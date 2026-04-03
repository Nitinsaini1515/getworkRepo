import { api } from "./api.js";

export async function fetchWallet() {
  const { data } = await api.get("/wallet");
  return data.data;
}

export async function addWalletFunds(amount) {
  const { data } = await api.post("/wallet/add", { amount });
  return data.data;
}

export async function fetchWalletTransactions() {
  const { data } = await api.get("/wallet/transactions");
  return data.data.transactions;
}
