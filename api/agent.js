const Anthropic = require('@anthropic-ai/sdk');
const { toolDefinitions, executeTool } = require('../lib/tools');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `你是 TALKCRAB Kepong 营运看板的助理。
你可以查询销售、petty cash、食材成本数据，也可以帮忙登记新的 petty cash 支出。
回答要简洁、直接给数字/结论，不要长篇大论。
金额一律以 RM 表示。如果数据查不到，直接说查不到，不要编造。`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body;
    let messages = [...history, { role: 'user', content: message }];
    let finalText = '';
    let safetyCounter = 0;

    while (safetyCounter < 6) {
      safetyCounter++;
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: toolDefinitions,
        messages,
      });

      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');

      if (toolUseBlocks.length === 0) {
        finalText = response.content
          .filter(b => b.type === 'text')
          .map(b => b.text)
          .join('\n');
        messages.push({ role: 'assistant', content: response.content });
        break;
      }

      messages.push({ role: 'assistant', content: response.content });

      const toolResults = [];
      for (const block of toolUseBlocks) {
        try {
          const result = await executeTool(block.name, block.input);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        } catch (err) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify({ error: err.message }),
            is_error: true,
          });
        }
      }

      messages.push({ role: 'user', content: toolResults });
    }

    return res.status(200).json({ reply: finalText, history: messages });
  } catch (err) {
    console.error('Agent error:', err);
    return res.status(500).json({ error: err.message });
  }
};
