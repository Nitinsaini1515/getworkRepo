import mongoose from "mongoose";
import { Feedback } from "../models/Feedback.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function refreshUserRating(toUserId) {
  const agg = await Feedback.aggregate([
    { $match: { toUser: new mongoose.Types.ObjectId(toUserId) } },
    { $group: { _id: null, avg: { $avg: "$rating" } } },
  ]);
  const avg = agg[0]?.avg ?? 0;
  await User.findByIdAndUpdate(toUserId, {
    rating: Math.round(avg * 10) / 10,
  });
}

export const submitFeedback = asyncHandler(async (req, res) => {
  const { toUser, rating, comment, jobId } = req.body;

  if (!toUser || !mongoose.isValidObjectId(toUser)) {
    throw new ApiError(400, "toUser is required");
  }
  const r = Number(rating);
  if (Number.isNaN(r) || r < 1 || r > 5) {
    throw new ApiError(400, "rating must be between 1 and 5");
  }

  if (String(toUser) === String(req.userId)) {
    throw new ApiError(400, "Cannot rate yourself");
  }

  const fb = await Feedback.create({
    fromUser: req.userId,
    toUser,
    rating: r,
    comment: comment?.trim() ?? "",
    jobId: jobId && mongoose.isValidObjectId(jobId) ? jobId : null,
  });

  await refreshUserRating(toUser);

  res.status(201).json({
    success: true,
    message: "Feedback recorded",
    data: {
      feedback: {
        id: String(fb._id),
        fromUser: String(fb.fromUser),
        toUser: String(fb.toUser),
        rating: fb.rating,
        comment: fb.comment,
        createdAt: fb.createdAt,
      },
    },
  });
});

export const listFeedbackForUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const rows = await Feedback.find({ toUser: userId })
    .sort({ createdAt: -1 })
    .populate("fromUser", "name profilePic role")
    .lean();

  const list = rows.map((f) => ({
    id: String(f._id),
    fromUser: f.fromUser
      ? {
          id: String(f.fromUser._id),
          name: f.fromUser.name,
          profilePic: f.fromUser.profilePic,
          role: f.fromUser.role,
        }
      : String(f.fromUser),
    toUser: String(f.toUser),
    rating: f.rating,
    comment: f.comment,
    createdAt: f.createdAt,
  }));

  res.json({ success: true, data: { feedback: list } });
});
