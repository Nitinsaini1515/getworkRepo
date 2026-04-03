import mongoose from "mongoose";

/**
 * Roles match frontend: "JobGiver" | "Worker"
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },

    role: {
      type: String,
      enum: ["JobGiver", "Worker"],
      required: true,
    },

    qualification: { type: String, trim: true, default: "" },
    skills: [{ type: String, trim: true }],
    primaryMobile: { type: String, trim: true, default: "" },
    alternateMobile: { type: String, trim: true, default: "" },

    businessName: { type: String, trim: true, default: "" },
    businessDetails: { type: String, trim: true, default: "" },

    governmentId: { type: String, trim: true, default: "" },
    profilePic: { type: String, trim: true, default: "" },

    walletBalance: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },

    isAvailable: { type: Boolean, default: false },

    // Dashboard / UI stats (aligned with AuthContext mock shapes)
    jobCredits: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    hoursBooked: { type: Number, default: 0 },
    hoursWorked: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    activeJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
