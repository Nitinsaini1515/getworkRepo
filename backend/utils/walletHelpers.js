import { WalletTransaction } from "../models/WalletTransaction.js";

export async function recordWalletTx(userId, type, amount, description, jobId = null, balanceAfter = null) {
  await WalletTransaction.create({
    userId,
    type,
    amount,
    description,
    jobId,
    balanceAfter,
  });
}
