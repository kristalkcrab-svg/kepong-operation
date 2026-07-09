const { readRange, appendRow } = require('../lib/sheets');

const SALES_SHEET_ID = process.env.SALES_SHEET_ID;
const PETTY_CASH_SHEET_ID = process.env.PETTY_CASH_SHEET_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const THRESHOLDS = {
  salesDropPct: 20,
};

async function sendTelegramAlert(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
  });
}

module.exports = async (req, res) => {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const alerts = [];

  try {
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const salesRows = await readRange(SALES_SHEET_ID, `'${thisMonth}'!A8:I200`);
    const validRows = salesRows.filter(r => r[0] && r[7]);

    if (validRows.length >= 8) {
      const today = validRows[validRows.length - 1];
      const lastWeekSameDay = validRows[validRows.length - 8];
      const todayRev = parseFloat(today[7]);
      const lastWeekRev = parseFloat(lastWeekSameDay[7]);
      if (!isNaN(todayRev) && !isNaN(lastWeekRev) && lastWeekRev > 0) {
        const dropPct = ((lastWeekRev - todayRev) / lastWeekRev) * 100;
        if (dropPct > THRESHOLDS.salesDropPct) {
          alerts.push(`⚠️ 今日营业额 RM${todayRev} 比上周同日跌 ${dropPct.toFixed(1)}%`);
        }
      }
    }

    const alertsTime = now.toISOString();

    if (alerts.length > 0) {
      await sendTelegramAlert(`*TALKCRAB Kepong 每日预警*\n\n${alerts.join('\n')}`);
      for (const a of alerts) {
        await appendRow(PETTY_CASH_SHEET_ID, 'AlertsLog!A:C', [alertsTime, a, 'active']);
      }
    } else {
      await appendRow(PETTY_CASH_SHEET_ID, 'AlertsLog!A:C', [alertsTime, '一切正常，无预警', 'ok']);
    }

    return res.status(200).json({ checked: true, alertsSent: alerts.length, alerts });
  } catch (err) {
    console.error('Cron alert error:', err);
    return res.status(500).json({ error: err.message });
  }
};
