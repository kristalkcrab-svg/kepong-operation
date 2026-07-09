const { readRange, appendRow, getFirstSheetTitle } = require('./sheets');

const SALES_SHEET_ID = process.env.SALES_SHEET_ID;
const PETTY_CASH_SHEET_ID = process.env.PETTY_CASH_SHEET_ID;
const CASH_SALES_SHEET_ID = process.env.CASH_SALES_SHEET_ID;
const REVIEWS_SHEET_ID = process.env.REVIEWS_SHEET_ID;
const FOODCOST_SHEET_ID = process.env.FOODCOST_SHEET_ID;

const toolDefinitions = [
  {
    name: 'query_sales',
    description: '查询指定日期范围内的业绩数据（dine in / delivery / take away / pickup / 总业绩 / 客单价）',
    input_schema: {
      type: 'object',
      properties: {
        start_date: { type: 'string', description: '开始日期 YYYY-MM-DD' },
        end_date: { type: 'string', description: '结束日期 YYYY-MM-DD' },
      },
      required: ['start_date', 'end_date'],
    },
  },
  {
    name: 'query_petty_cash',
    description: '查询零用金报表的原始数据（表格结构不固定，会附带表头，自己判断栏位含义）',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'add_petty_cash_entry',
    description: '登记一笔新的零用金支出。会先读取表头，自动对应"日期/分类/描述/金额"这几种栏位再写入。',
    input_schema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'YYYY-MM-DD' },
        category: { type: 'string' },
        description: { type: 'string' },
        amount: { type: 'number' },
      },
      required: ['date', 'category', 'description', 'amount'],
    },
  },
  {
    name: 'query_cash_sales',
    description: '查询门市现金业绩的原始数据（表格结构不固定，会附带表头，自己判断栏位含义）',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'query_reviews',
    description: '查询门市好评追踪表的原始数据（表格结构不固定，会附带表头，自己判断栏位含义）',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'query_food_cost',
    description: '查询食材成本数据（表格结构不固定，会附带表头，自己判断栏位含义）',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
];

async function readWholeFirstSheet(sheetId) {
  const title = await getFirstSheetTitle(sheetId);
  const rows = await readRange(sheetId, `'${title}'!A1:Z200`);
  return { sheetName: title, rows };
}

async function executeTool(name, input) {
  switch (name) {
    case 'query_sales': {
      const month = input.start_date.slice(0, 7);
      const rows = await readRange(SALES_SHEET_ID, `'${month}'!A8:I200`);
      const filtered = rows.filter(r => r[0] >= input.start_date && r[0] <= input.end_date);
      const totalSales = filtered.reduce((sum, r) => sum + (parseFloat(r[7]) || 0), 0);
      return {
        columns: ['date', 'dine_in', 'delivery', 'take_away', 'pickup', 'delivery_fees', 'total_pax', 'total_sales', 'per_head_spending'],
        rows: filtered,
        total_sales: totalSales,
      };
    }

    case 'query_petty_cash': {
      return await readWholeFirstSheet(PETTY_CASH_SHEET_ID);
    }

    case 'query_cash_sales': {
      return await readWholeFirstSheet(CASH_SALES_SHEET_ID);
    }

    case 'query_reviews': {
      return await readWholeFirstSheet(REVIEWS_SHEET_ID);
    }

    case 'query_food_cost': {
      return await readWholeFirstSheet(FOODCOST_SHEET_ID);
    }

    case 'add_petty_cash_entry': {
      const title = await getFirstSheetTitle(PETTY_CASH_SHEET_ID);
      const rows = await readRange(PETTY_CASH_SHEET_ID, `'${title}'!A1:Z1`);
      const header = (rows[0] || []).map(h => (h || '').toLowerCase());

      const newRow = header.map(h => {
        if (h.includes('date') || h.includes('日期')) return input.date;
        if (h.includes('categor') || h.includes('分类') || h.includes('类别')) return input.category;
        if (h.includes('desc') || h.includes('说明') || h.includes('描述') || h.includes('备注')) return input.description;
        if (h.includes('amount') || h.includes('金额') || h.includes('支出')) return input.amount;
        return '';
      });

      await appendRow(PETTY_CASH_SHEET_ID, `'${title}'!A:Z`, newRow);
      return { success: true, message: `已登记：${input.date} ${input.category} RM${input.amount}`, matched_header: header };
    }

    default:
      throw new Error(`未知工具: ${name}`);
  }
}

module.exports = { toolDefinitions, executeTool };
