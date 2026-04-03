import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    pay: { type: Number, required: true, min: 0 },
    hours: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },

    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    applicants: [applicantSchema],

    status: {
      type: String,
      enum: ["open", "applied", "accepted", "pending", "completed"],
      default: "open",
    },

    scheduledAt: { type: Date, default: null },
    experience: { type: String, default: "" },
    tier: { type: String, default: "Standard" },

    /** Locked payout amount for the worker (pay × parsed hours). */
    escrowAmount: { type: Number, default: 0, min: 0 },
    proofImageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

jobSchema.index({ employer: 1, status: 1 });
jobSchema.index({ worker: 1 });

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
