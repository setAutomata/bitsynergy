import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["system", "user", "assistant", "tool"],
    required: true,
  },
  content: { type: String, required: true },
  images: {
    type: [String],
    required: false,
    validate: function (arr) {
      return arr.every(
        (str) => typeof str === "string" && /^[A-Za-z0-9+/=]+$/.test(str)
      );
    },
    message: "Each image must be a valid Base64 image URL",
  },
});

messageSchema.pre("save", function (next) {
  if (this.role !== "user") this.images = undefined;
  next();
});

export default messageSchema;
