const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const Conversation = require("../Conversation.model"); // Import the Conversation model
const trainingData = require("../training_data.json");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res, next) => {
    const { uid, userInput } = req.body;
    try {
        // Find or create a new conversation
        let conversation = await Conversation.findOne({ uid: uid });
        if (!conversation) {
            conversation = new Conversation({
                uid: uid,
                messages: [],
                tokens: 0,
                me:
                    req.ip === "::1" || req.ip === process.env.MY_IP
                        ? true
                        : false,
            });
        }
        // Add user message to conversation history
        if (!userInput || userInput.trim() === "" || userInput.length > 150) {
            res.status(400).json({ message: "Invalid user input", data: null });
            return;
        } else {
            conversation.messages.push({ role: "user", content: userInput });
        }

        // Create completion with conversation history
        const completion = await openai.chat.completions.create({
            messages: [...trainingData, ...conversation.messages],
            model: "gpt-3.5-turbo-1106",
        });

        // Add assistant's response to conversation history
        const assistantMessage = completion.choices[0].message.content;
        conversation.messages.push({
            role: "assistant",
            content: assistantMessage,
        });
        conversation.tokens += completion.usage.total_tokens;

        // Save the updated conversation
        await conversation.save();

        // Send response
        res.json({ message: "Successful!", data: assistantMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", data: null });
    }
});

module.exports = router;
