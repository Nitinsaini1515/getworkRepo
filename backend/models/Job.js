import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const JOB_STATUSES = ["open", "applied", "in-progress", "completed"];

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
      enum: JOB_STATUSES,
      default: "open",
    },

    /** Set when worker scans QR / starts the job on-site */
    startTime: { type: Date, default: null },

    scheduledAt: { type: Date, default: null },
    experience: { type: String, default: "" },
    tier: { type: String, default: "Standard" },

    escrowAmount: { type: Number, default: 0, min: 0 },
    /** @deprecated prefer completionPhotos — kept for older clients */
    proofImageUrl: { type: String, default: "" },
    completionPhotos: [{ type: String, trim: true }],

    /** Employer notified after worker marks job complete */
    employerNotifiedAt: { type: Date, default: null },

    /** Escrow released to worker (mirrors payment completion) */
    paymentReleasedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

jobSchema.index({ employer: 1, status: 1 });
jobSchema.index({ worker: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ "applicants.user": 1 });

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
