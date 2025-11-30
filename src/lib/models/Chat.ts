import { Schema, model, models, Types } from "mongoose";

const ChatSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New chat" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model("Chat", ChatSchema);
