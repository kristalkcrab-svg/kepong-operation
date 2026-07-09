// lib/tools.js
// 改用跟 dashboard 本身一样的"发布到网络"CSV 网址读取数据，
// 不再直接用 Google Sheets API 读取（避开 Office 格式/权限问题，且保证跟 dashboard 显示一致）

const { fetchCSV } = require('./csv-fetch');
const { SALES_CSV, PETTY_CSV, REMIT_CSV, REVIEW_CSV, FOODCOST_CSV } = require('./csv-sources');

function currentMonth() {
  const m = new Date().getMonth() + 1; // 1-12
  return (m >= 7 && m <= 12) ? m : 7; // 数据只有7-12月，超出范围就退回7月
}

const toolDefinitions = [
  {
    name: 'query_sales',
    description: '查询指定月份的业绩数据（dine in / delivery / take away / pickup / 总业绩 / 客单价），逐日明细',
    input_schema: {
      type: 'object',
      properties: {
        month: { type: 'integer', description: '月份，7-12之间的数字，例如7代表七月。不填则用当前月份。' },
      },
      required: [],
    },
  },
  {
    name: 'query_petty_cash',
    description: '查询指定月份的零用金报表原始数据（含表头，自己判断栏位含义）',
    input_schema: {
      type: 'object',
      properties: {
        month: { type: 'integer', description: '月份，7-12之间的数字，不填则用当前月份' },
      },
      required: [],
    },
  },
  {
    name: 'query_cash_sales',
    description: '查询指定月份的业绩现金汇款明细（业绩现金/汇款金额/无法汇款金额）',
    input_schema: {
      type: 'object',
      properties: {
        month: { type: 'integer', description: '月份，7-12之间的数字，不填则用当前月份' },
      },
      required: [],
    },
  },
  {
    name: 'query_reviews',
    description: '查询门市好评追踪表的原始数据（含表头，自己判断栏位含义）',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'query_food_cost',
    description: '查询指定月份的食材成本/厂商采购数据（含表头，自己判断栏位含义）',
    input_schema: {
      type: 'object',
      properties: {
        month: { type: 'integer', description: '月份，7-12之间的数字，不填则用当前月份' },
      },
      required: [],
    },
  },
];

async function executeTool(name, input) {
  const month = input.month || currentMonth();

  switch (name) {
    case 'query_sales': {
      const url = SALES_CSV[month];
      if (!url) throw new Error(`没有 ${month} 月的业绩数据来源`);
      const rows = await fetchCSV(url);
      return { month, rows };
    }

    case 'query_petty_cash': {
      const url = PETTY_CSV[month];
      if (!url) throw new Error(`没有 ${month} 月的零用金数据来源`);
      const rows = await fetchCSV(url);
      return { month, rows };
    }

    case 'query_cash_sales': {
      const url = REMIT_CSV[month];
      if (!url) throw new Error(`没有 ${month} 月的现金业绩数据来源`);
      const rows = await fetchCSV(url);
      return { month, rows };
    }

    case 'query_reviews': {
      const rows = await fetchCSV(REVIEW_CSV);
      return { rows };
    }

    case 'query_food_cost': {
      const url = FOODCOST_CSV[month];
      if (!url) throw new Error(`没有 ${month} 月的食材成本数据来源`);
      const rows = await fetchCSV(url);
      return { month, rows };
    }

    default:
      throw new Error(`未知工具: ${name}`);
  }
}

module.exports = { toolDefinitions, executeTool };
