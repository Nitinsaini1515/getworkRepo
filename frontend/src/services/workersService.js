import { api } from "./api.js";

export async function fetchAvailableWorkers() {
  const { data } = await api.get("/worker/available");
  return data.data.workers;
}

export async function updateWorkerAvailability(isAvailable) {
  const { data } = await api.patch("/worker/availability", { isAvailable });
  return data.data.user;
}
