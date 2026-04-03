import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
  },
  { timestamps: true }
);

feedbackSchema.index({ toUser: 1, createdAt: -1 });

export const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
