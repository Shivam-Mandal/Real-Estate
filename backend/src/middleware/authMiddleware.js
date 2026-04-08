import { User } from "../models/User.js";
import { verifyAccessToken } from "../services/tokenService.js";
import { authorize as roleAuthorize } from "./roleMiddleware.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("User no longer exists");
  }

  req.user = user;
  next();
};

export const authorize = (...roles) => (req, res, next) => {
  return roleAuthorize(...roles)(req, res, next);
};
