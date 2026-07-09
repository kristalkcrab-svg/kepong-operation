const { readRange, appendRow } = require('../lib/sheets');

const SHEET_ID = process.env.KEPONG_SHEET_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const THRESHOLDS = {
  foodCostPct: 35,
  pettyCashLow: 200,
  salesDropPct: 20,
};

async function sendTelegramAlert(text) {
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
    const pettyCashRows = await readRange(SHEET_ID, 'PettyCash!A2:E');
    if (pettyCashRows.length > 0) {
      const lastRow = pettyCashRows[pettyCashRows.length - 1];
      const balance = parseFloat(lastRow[4]);
      if (!isNaN(balance) && balance < THRESHOLDS.pettyCashLow) {
        alerts.push(`⚠️ Petty cash 余额只剩 RM${balance.toFixed(2)}，低于 RM${THRESHOLDS.pettyCashLow}，记得补款`);
      }
    }

    const foodCostRows = await readRange(SHEET_ID, 'FoodCost!A2:D');
    if (foodCostRows.length > 0) {
      const lastRow = foodCostRows[foodCostRows.length - 1];
      const pct = parseFloat(lastRow[3]);
      if (!isNaN(pct) && pct > THRESHOLDS.foodCostPct) {
        alerts.push(`⚠️ 食材成本占比 ${pct.toFixed(1)}%，超过 ${THRESHOLDS.foodCostPct}% 警戒线（${lastRow[0]}）`);
      }
    }

    const salesRows = await readRange(SHEET_ID, 'Sales!A2:F');
    if (salesRows.length >= 8) {
      const today = salesRows[salesRows.length - 1];
      const lastWeekSameDay = salesRows[salesRows.length - 8];
      const todayRev = parseFloat(today[1]);
      const lastWeekRev = parseFloat(lastWeekSameDay[1]);
      if (!isNaN(todayRev) && !isNaN(lastWeekRev) && lastWeekRev > 0) {
        const dropPct = ((lastWeekRev - todayRev) / lastWeekRev) * 100;
        if (dropPct > THRESHOLDS.salesDropPct) {
          alerts.push(`⚠️ 今日营业额 RM${todayRev} 比上周同日跌 ${dropPct.toFixed(1)}%`);
        }
      }
    }

    const now = new Date().toISOString();

    if (alerts.length > 0) {
      await sendTelegramAlert(`*TALKCRAB Kepong 每日预警*\n\n${alerts.join('\n')}`);
      for (const a of alerts) {
        await appendRow(SHEET_ID, 'AlertsLog!A:C', [now, a, 'active']);
      }
    } else {
      await appendRow(SHEET_ID, 'AlertsLog!A:C', [now, '一切正常，无预警', 'ok']);
    }

    return res.status(200).json({ checked: true, alertsSent: alerts.length, alerts });
  } catch (err) {
    console.error('Cron alert error:', err);
    return res.status(500).json({ error: err.message });
  }
};
