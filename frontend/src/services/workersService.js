import { api } from "./api.js";

export async function fetchAvailableWorkers() {
  const { data } = await api.get("/worker/available");
  return data.data.workers;
}

/** Dummy map markers — GET /api/workers/nearby */
export async function fetchNearbyWorkers(lat, lng) {
  const { data } = await api.get("/workers/nearby", {
    params: { lat, lng },
  });
  return data.data;
}

export async function updateWorkerAvailability(isAvailable) {
  const { data } = await api.patch("/worker/availability", { isAvailable });
  return data.data.user;
}
