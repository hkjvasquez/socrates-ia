const OpenAI = require("openai");

const cliente = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = cliente;