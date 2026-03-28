import mongoose from "mongoose";
import messageSchema from "./Message.js";

const chatSchema = new mongoose.Schema({
  title: { type: String, required: false },
  messages: [messageSchema],
  timestamp: { type: Date, default: Date.now },
});

export default chatSchema;
