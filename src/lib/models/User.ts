import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    image: String,
    credits: { type: Number, default: 100 }, // starter credits
    providerId: String,                      // Google sub id
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
