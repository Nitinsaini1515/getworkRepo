import { api } from "./api.js";

export async function fetchJobs() {
  const { data } = await api.get("/jobs");
  return data.data.jobs;
}

export async function fetchJobById(id) {
  const { data } = await api.get(`/jobs/${id}`);
  return data.data.job;
}

export async function createJob(body) {
  const { data } = await api.post("/jobs/create", body);
  return data.data.job;
}

export async function applyToJob(jobId) {
  const { data } = await api.post(`/jobs/apply/${jobId}`);
  return data.data.job;
}

export async function acceptApplicant(jobId, workerId) {
  const { data } = await api.post(`/jobs/accept/${jobId}`, { workerId });
  return data.data.job;
}

export async function uploadJobProof(jobId, file) {
  const form = new FormData();
  form.append("jobId", jobId);
  form.append("proof", file);
  const { data } = await api.post("/jobs/upload-proof", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.job;
}

export async function approveJobCompletion(jobId) {
  const { data } = await api.post("/jobs/approve", { jobId });
  return data.data;
}
