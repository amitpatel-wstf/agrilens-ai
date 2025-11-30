import { Schema, model, models, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    chatId: { type: Types.ObjectId, ref: "Chat", required: true },
    userId: { type: Types.ObjectId, ref: "User" }, // null for assistant
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = models.Message || model("Message", MessageSchema);
