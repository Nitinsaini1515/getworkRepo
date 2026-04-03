import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["addition", "deduction", "credit", "debit"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: "" },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
    balanceAfter: { type: Number, default: null },
  },
  { timestamps: true }
);

export const WalletTransaction =
  mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", walletTransactionSchema);
