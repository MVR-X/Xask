import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

router.get("/google", (req, res) => {
  try {
    console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Redirect URI:", process.env.GOOGLE_REDIRECT_URI);

    if (!process.env.GOOGLE_REDIRECT_URI) {
      throw new Error(
        "GOOGLE_REDIRECT_URI is not defined in environment variables"
      );
    }

    const authUrl = client.generateAuthUrl({
      scope: ["profile", "email"],
      access_type: "offline",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    res.json({ url: authUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).json({
      message: "Failed to generate Google auth URL",
      error: error.message,
    });
  }
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      throw new Error("No code provided in callback");
    }

    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.findOne({ email: payload.email });
      if (user) {
        user.googleId = payload.sub;
        await user.save();
      } else {
        user = new User({
          userName: payload.name,
          email: payload.email,
          googleId: payload.sub,
          avatar: payload.picture,
        });
        await user.save();
      }
    }

    if (!process.env.JWT_TOKEN) {
      throw new Error("JWT_TOKEN is not defined in environment variables");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    const frontendUrl =
      process.env.NODE_ENV === "prod"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173";
    res.redirect(
      `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
});

export default router;
