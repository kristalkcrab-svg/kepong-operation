const { readRange, appendRow } = require('./sheets');

const SHEET_ID = process.env.KEPONG_SHEET_ID;

const toolDefinitions = [
  {
    name: 'query_sales',
    description: '查询指定日期范围内的销售数据（营业额、单量等）',
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
    description: '查询 petty cash 支出记录，可按日期范围或分类查询',
    input_schema: {
      type: 'object',
      properties: {
        start_date: { type: 'string' },
        end_date: { type: 'string' },
        category: { type: 'string', description: '可选，例如"食材"、"维修"等' },
      },
      required: ['start_date', 'end_date'],
    },
  },
  {
    name: 'add_petty_cash_entry',
    description: '登记一笔新的 petty cash 支出',
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
    name: 'query_food_cost',
    description: '查询食材成本占比数据',
    input_schema: {
      type: 'object',
      properties: {
        start_date: { type: 'string' },
        end_date: { type: 'string' },
      },
      required: ['start_date', 'end_date'],
    },
  },
];

async function executeTool(name, input) {
  switch (name) {
    case 'query_sales': {
      const rows = await readRange(SHEET_ID, 'Sales!A2:F');
      const filtered = rows.filter(r => r[0] >= input.start_date && r[0] <= input.end_date);
      return { rows: filtered, count: filtered.length };
    }
    case 'query_petty_cash': {
      const rows = await readRange(SHEET_ID, 'PettyCash!A2:E');
      let filtered = rows.filter(r => r[0] >= input.start_date && r[0] <= input.end_date);
      if (input.category) {
        filtered = filtered.filter(r => r[1] === input.category);
      }
      const total = filtered.reduce((sum, r) => sum + (parseFloat(r[3]) || 0), 0);
      return { rows: filtered, total };
    }
    case 'add_petty_cash_entry': {
      await appendRow(SHEET_ID, 'PettyCash!A:E', [
        input.date,
        input.category,
        input.description,
        input.amount,
        '',
      ]);
      return { success: true, message: `已登记：${input.date} ${input.category} RM${input.amount}` };
    }
    case 'query_food_cost': {
      const rows = await readRange(SHEET_ID, 'FoodCost!A2:D');
      const filtered = rows.filter(r => r[0] >= input.start_date && r[0] <= input.end_date);
      return { rows: filtered };
    }
    default:
      throw new Error(`未知工具: ${name}`);
  }
}

module.exports = { toolDefinitions, executeTool };
