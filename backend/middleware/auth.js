import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function getTokenFromHeader(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }
  return auth.split(" ")[1];
}

export const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    throw new ApiError(401, "Not authorized — no token provided");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "Server misconfiguration: JWT_SECRET is not set");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    throw new ApiError(401, "Not authorized — invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "Not authorized — user no longer exists");
  }

  req.user = user;
  req.userId = user._id;
  next();
});

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Not authenticated"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden for this role"));
    }
    next();
  };
}
