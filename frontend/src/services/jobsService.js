import { api } from "./api.js";

export async function fetchJobs() {
  const { data } = await api.get("/jobs");
  return data.data.jobs;
}

export async function fetchAppliedJobs() {
  const { data } = await api.get("/jobs/applied");
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

export async function startJob(jobId) {
  const { data } = await api.post(`/jobs/start/${jobId}`);
  return data.data.job;
}

export async function completeJob(jobId, files) {
  const form = new FormData();
  const arr = Array.isArray(files) ? files : [files];
  for (const f of arr) {
    if (f) form.append("photos", f);
  }
  const { data } = await api.post(`/jobs/complete/${jobId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.job;
}
