import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, trim: true, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SOSAlert =
  mongoose.models.SOSAlert || mongoose.model("SOSAlert", sosAlertSchema);
