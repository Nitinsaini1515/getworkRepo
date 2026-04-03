import { api } from "./api.js";

export async function fetchChatMessages(jobId) {
  const { data } = await api.get(`/chat/${jobId}`);
  return data.data.messages;
}

export async function sendChatMessage({ jobId, message, receiverId }) {
  const { data } = await api.post("/chat/send", { jobId, message, receiverId });
  return data.data.message;
}
