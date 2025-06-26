const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeChat(chatJson) {
    const prompt = `
You are a relationship coach analyzing a Telegram chat in JSON format.

1. Summarize the relationship dynamics.
2. Who shows more affection or distance?
3. Are there signs of conflict, misunderstanding, or care?

Here is the chat:
${chatJson.slice(0, 3000)}  // Limit to prevent prompt overload
`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
}

module.exports = { analyzeChat };
