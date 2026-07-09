// lib/csv-fetch.js
const Papa = require('papaparse');

async function fetchCSV(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
  const text = await res.text();
  if (!text || text.trim().startsWith('<')) throw new Error('CSV fetch returned non-CSV content');
  return Papa.parse(text, { header: false, skipEmptyLines: true }).data;
}

module.exports = { fetchCSV };
