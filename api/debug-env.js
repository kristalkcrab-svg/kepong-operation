// api/debug-env.js
// 诊断用：检查所有环境变量是否有值、格式对不对
// 用法：浏览器直接打开 https://kepong-operation.vercel.app/api/debug-env
// 看完确认没问题后，建议之后把这个文件删掉（避免暴露信息给外人）

module.exports = async (req, res) => {
  const vars = [
    'ANTHROPIC_API_KEY',
    'SALES_SHEET_ID',
    'PETTY_CASH_SHEET_ID',
    'CASH_SALES_SHEET_ID',
    'REVIEWS_SHEET_ID',
    'FOODCOST_SHEET_ID',
    'GOOGLE_SERVICE_ACCOUNT_JSON',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'CRON_SECRET',
  ];

  const report = {};

  for (const key of vars) {
    const val = process.env[key];
    if (!val) {
      report[key] = { status: '❌ 完全没有值（空的）' };
      continue;
    }

    const hasNewline = /[\r\n]/.test(val);
    const trimmedLen = val.trim().length;

    if (key === 'GOOGLE_SERVICE_ACCOUNT_JSON') {
      let jsonOk = false;
      let jsonError = null;
      try {
        const parsed = JSON.parse(val);
        jsonOk = !!parsed.client_email && !!parsed.private_key;
      } catch (e) {
        jsonError = e.message;
      }
      report[key] = {
        length: val.length,
        contains_newline_chars: hasNewline,
        valid_json: jsonOk,
        json_parse_error: jsonError,
        status: jsonOk ? '✅ 看起来正常' : '❌ 不是有效的JSON或缺少必要栏位',
      };
    } else {
      report[key] = {
        length: val.length,
        trimmed_length: trimmedLen,
        contains_newline_chars: hasNewline,
        preview: val.slice(0, 8) + '...',
        status: hasNewline
          ? '⚠️ 内容里混进了换行符号，需要重新贴过'
          : (trimmedLen === 0 ? '❌ 内容是空白' : '✅ 看起来正常'),
      };
    }
  }

  return res.status(200).json(report);
};
