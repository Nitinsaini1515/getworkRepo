import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { serializeUser, getUserJobContext } from "../utils/userSerializer.js";

const SALT_ROUNDS = 12;

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "Server misconfiguration: JWT_SECRET is not set");
  }
  return jwt.sign({ id: userId.toString() }, secret, { expiresIn: "7d" });
}

function normalizeRole(role) {
  if (!role) return null;
  const r = String(role).trim();
  if (r === "JobGiver" || r === "employer") return "JobGiver";
  if (r === "Worker" || r === "worker") return "Worker";
  return null;
}

function parseSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role: rawRole,
    qualification,
    skills,
    primaryMobile,
    alternateMobile,
    businessName,
    businessDetails,
    governmentId,
    profilePic,
  } = req.body;

  const role = normalizeRole(rawRole);
  if (!role) {
    throw new ApiError(400, "Role must be JobGiver or Worker");
  }

  if (!name?.trim()) {
    throw new ApiError(400, "Name is required");
  }
  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }
  if (!password || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
    qualification: qualification?.trim() ?? "",
    skills: parseSkills(skills),
    primaryMobile: primaryMobile?.trim() ?? "",
    alternateMobile: alternateMobile?.trim() ?? "",
    businessName: businessName?.trim() ?? "",
    businessDetails: businessDetails?.trim() ?? "",
    governmentId: typeof governmentId === "string" ? governmentId.trim() : "",
    profilePic: typeof profilePic === "string" ? profilePic.trim() : "",
  });

  const fresh = await User.findById(user._id);
  const ctx = await getUserJobContext(fresh._id, fresh.role);
  const out = { ...serializeUser(fresh), ...ctx };

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: { user: out, token: signToken(fresh._id) },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user._id);
  const fresh = await User.findById(user._id);
  const ctx = await getUserJobContext(fresh._id, fresh.role);
  const out = { ...serializeUser(fresh), ...ctx };

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: out,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  const fresh = await User.findById(req.userId);
  if (!fresh) {
    throw new ApiError(401, "User not found");
  }
  const ctx = await getUserJobContext(fresh._id, fresh.role);
  const out = { ...serializeUser(fresh), ...ctx };
  res.json({ success: true, data: { user: out } });
});
