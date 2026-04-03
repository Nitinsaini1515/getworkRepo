import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = rawBase.replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("getwork_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("getwork_token");
      localStorage.removeItem("getwork_user");
      window.dispatchEvent(new CustomEvent("getwork:auth-expired", { detail: { status } }));
    }
    return Promise.reject(error);
  }
);
