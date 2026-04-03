import { api } from "./api.js";

export async function loginRequest(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data;
}

export async function registerRequest(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.data.user;
}
