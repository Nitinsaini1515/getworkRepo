import { api } from "./api.js";

export async function sendSOSAlert({ message, timestamp }) {
  const { data } = await api.post("/sos", { message, timestamp });
  return data.data.sos;
}
