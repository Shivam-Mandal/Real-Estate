import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    env.accessSecret,
    { expiresIn: env.accessExpiresIn },
  );

export const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, env.refreshSecret, {
    expiresIn: env.refreshExpiresIn,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.accessSecret);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.refreshSecret);
