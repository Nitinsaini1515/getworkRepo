import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { serializeUser } from "../utils/userSerializer.js";

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

  const { isAvailable } = req.body;
  if (typeof isAvailable !== "boolean") {
    throw new ApiError(400, "isAvailable must be a boolean");
  }

  const user = await User.findById(req.userId);
  user.isAvailable = isAvailable;
  await user.save();

  res.json({
    success: true,
    message: "Availability updated",
    data: { user: serializeUser(user) },
  });
});
