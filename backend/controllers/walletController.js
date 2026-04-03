import { User } from "../models/User.js";
import { WalletTransaction } from "../models/WalletTransaction.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordWalletTx } from "../utils/walletHelpers.js";
import { serializeUser } from "../utils/userSerializer.js";

export const addFunds = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (Number.isNaN(amount) || amount <= 0) {
    throw new ApiError(400, "amount must be a positive number");
  }

  const user = await User.findById(req.userId);
  user.walletBalance = Math.round((user.walletBalance + amount) * 100) / 100;
  await user.save();

  await recordWalletTx(
    user._id,
    "addition",
    amount,
    "Wallet top-up",
    null,
    user.walletBalance
  );

  res.json({
    success: true,
    message: "Balance added",
    data: { user: serializeUser(user) },
  });
});

export const getWallet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({
    success: true,
    data: {
      walletBalance: user.walletBalance,
      user: serializeUser(user),
    },
  });
});

export const listTransactions = asyncHandler(async (req, res) => {
  const rows = await WalletTransaction.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const transactions = rows.map((t) => ({
    id: String(t._id),
    type: t.type,
    amount: t.amount,
    description: t.description,
    jobId: t.jobId ? String(t.jobId) : null,
    balanceAfter: t.balanceAfter,
    createdAt: t.createdAt,
  }));

  res.json({ success: true, data: { transactions } });
});
