import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  serializeUser,
  getUserJobContext,
} from "../utils/userSerializer.js";

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

/** Dummy markers for map — anchored to query lat/lng */
export const nearbyWorkers = asyncHandler(async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const baseLat = Number.isFinite(lat) ? lat : 28.7041;
  const baseLng = Number.isFinite(lng) ? lng : 77.1025;

  const offsets = [
    [0.0009, 0.0009],
    [0.001, 0.0015],
    [0.0018, 0.0004],
  ];

  const data = offsets.map(([dlat, dlng], i) => ({
    name: `Worker ${i + 1}`,
    lat: Math.round((baseLat + dlat) * 1e6) / 1e6,
    lng: Math.round((baseLng + dlng) * 1e6) / 1e6,
    isAvailable: true,
  }));

  res.json({ success: true, data });
});

export const listAvailableWorkers = asyncHandler(async (req, res) => {
  const workers = await User.find({
    role: "Worker",
    isAvailable: true,
  })
    .select(
      "name skills rating profilePic completedJobs qualification businessName"
    )
    .limit(80)
    .lean();

  const list = workers.map((w, i) => ({
    id: String(w._id),
    name: w.name,
    skills: Array.isArray(w.skills) ? w.skills.join(", ") : "",
    rating: w.rating ?? 0,
    jobs: w.completedJobs ?? 0,
    lat: 40.7128 + (i % 5) * 0.02,
    lng: -74.006 + (i % 3) * 0.02,
    distance: `${(0.5 + i * 0.3).toFixed(1)} miles`,
  }));

  res.json({ success: true, data: { workers: list } });
});

export const setAvailability = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "Only workers can update availability");
  }

  const raw = req.body?.isAvailable;
  let isAvailable;
  if (raw === true || raw === "true") isAvailable = true;
  else if (raw === false || raw === "false") isAvailable = false;
  else {
    throw new ApiError(400, "isAvailable must be a boolean");
  }

  const user = await User.findById(req.userId);
  user.isAvailable = isAvailable;
  await user.save();
  const ctx = await getUserJobContext(user._id, user.role);

  res.json({
    success: true,
    message: "Availability updated",
    data: { user: { ...serializeUser(user), ...ctx } },
  });
});

export const updateWorkerProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "Worker") {
    throw new ApiError(403, "Only workers can update this profile");
  }

  const { name, location, qualification, skills } = req.body ?? {};
  const user = await User.findById(req.userId);

  if (typeof name === "string" && name.trim()) {
    user.name = name.trim();
  }
  if (typeof location === "string") {
    user.location = location.trim();
  }
  if (typeof qualification === "string") {
    user.qualification = qualification.trim();
  }
  if (skills !== undefined) {
    user.skills = parseSkills(skills);
  }

  await user.save();
  const ctx = await getUserJobContext(user._id, user.role);

  res.json({
    success: true,
    message: "Profile updated",
    data: { user: { ...serializeUser(user), ...ctx } },
  });
});
