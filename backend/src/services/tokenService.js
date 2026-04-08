import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET || "access-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-secret";
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    accessSecret,
    { expiresIn: accessExpiresIn },
  );

export const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, accessSecret);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, refreshSecret);
