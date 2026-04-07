import crypto from "crypto";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/tokenService.js";

const shapeAuthPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar,
});

const persistRefreshToken = async (userId, token) => {
  await RefreshToken.create({
    user: userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

const issueAuthResponse = async (res, user, statusCode = 200) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await RefreshToken.deleteMany({
    user: user._id,
    expiresAt: { $lte: new Date() },
  });
  await persistRefreshToken(user._id, refreshToken);

  res.status(statusCode).json({
    success: true,
    user: shapeAuthPayload(user),
    accessToken,
    refreshToken,
  });
};

export const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRole = role || "user";
  if (!["user", "agent"].includes(normalizedRole)) {
    res.status(400);
    throw new Error("Invalid registration role");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    phone,
    role: normalizedRole,
  });

  await issueAuthResponse(res, user, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is inactive");
  }

  await issueAuthResponse(res, user);
};

export const refresh = async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) {
    res.status(400);
    throw new Error("Refresh token required");
  }

  const storedToken = await RefreshToken.findOne({ token }).populate("user");
  if (!storedToken) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  verifyRefreshToken(token);

  if (storedToken.expiresAt <= new Date()) {
    await RefreshToken.deleteOne({ _id: storedToken._id });
    res.status(401);
    throw new Error("Refresh token expired");
  }

  await RefreshToken.deleteOne({ _id: storedToken._id });
  await issueAuthResponse(res, storedToken.user);
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const me = async (req, res) => {
  res.status(200).json({
    success: true,
    user: shapeAuthPayload(req.user),
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    res.status(200).json({
      success: true,
      message: "If an account exists for that email, a reset token has been generated.",
    });
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password reset token generated",
    resetToken,
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("New password is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or expired");
  }

  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpiresAt = null;
  await user.save();
  await RefreshToken.deleteMany({ user: user._id });

  await issueAuthResponse(res, user);
};
