import { api } from "./api.js";

export async function submitFeedback({ toUser, rating, comment, jobId }) {
  const { data } = await api.post("/feedback", {
    toUser,
    rating,
    comment,
    jobId,
  });
  return data.data.feedback;
}

export async function fetchFeedbackForUser(userId) {
  const { data } = await api.get(`/feedback/${userId}`);
  return data.data.feedback;
}
