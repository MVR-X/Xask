import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }, // Password not required for Google users
    },
    avatar: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple users without googleId
    },
    bio: { type: String, default: "" }, // User bio or description
    isActive: { type: Boolean, default: true }, // Account active status
  },
  { timestamps: true }
);

const umodel = mongoose.model("User", userSchema);
export default umodel;
