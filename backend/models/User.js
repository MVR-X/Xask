import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" }, // URL to profile picture
    bio: { type: String, default: "" }, // User bio or description
    isAdmin: { type: Boolean, default: false }, // Admin status
    isActive: { type: Boolean, default: true }, // Account active status
  },
  { timestamps: true }
);

const umodel = mongoose.model("User", userSchema);
export default umodel;
