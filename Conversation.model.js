const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        role: String,
        content: String,
    },
    {
        _id: false,
        timestamps: false,
    }
);

const conversationSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            unique: true,
            required: true,
        },
        messages: [messageSchema],
        tokens: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
