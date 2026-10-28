
require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Groq AI Chat API is running!");
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body || {};

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a valid message."
            });
        }

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant. Give clear and accurate answers."
                },
                {
                    role: "user",
                    content: message.trim()
                }
            ]
        });

        res.json({
            reply: completion.choices[0].message.content
        });
    } catch (error) {
        console.error("Groq API error:", error.message);

        res.status(500).json({
            error: "AI response failed. Check your Groq API key and model."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Groq AI running at http://localhost:${PORT}`);
});
