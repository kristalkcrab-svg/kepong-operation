const { readRange } = require('../lib/sheets');

const SHEET_ID = process.env.PETTY_CASH_SHEET_ID;

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit) || 10;
    const rows = await readRange(SHEET_ID, 'AlertsLog!A:C');

    const latest = rows.slice(-limit).reverse().map(r => ({
      timestamp: r[0],
      message: r[1],
      status: r[2],
    }));

    return res.status(200).json({ alerts: latest });
  } catch (err) {
    console.error('get-alerts error:', err);
    return res.status(500).json({ error: err.message });
  }
};
