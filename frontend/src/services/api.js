import axios from "axios";

/** Production API — set VITE_API_URL on Vercel to your Render URL (no trailing slash). */
const PRODUCTION_API_ORIGIN = "https://getworkmain.onrender.com";
const rawBase = (
  import.meta.env.VITE_API_URL?.trim() || PRODUCTION_API_ORIGIN
).replace(/\/$/, "");

if (!import.meta.env.VITE_API_URL?.trim()) {
  console.warn(
    "[GetWork] VITE_API_URL is unset; using:",
    PRODUCTION_API_ORIGIN,
    "(set VITE_API_URL in .env for local backend)"
  );
}

export const api = axios.create({
  baseURL: `${rawBase}/api`,
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
    if (!error.response) {
      const url = error.config?.baseURL
        ? `${error.config.baseURL}${error.config.url ?? ""}`
        : "";
      console.warn("[GetWork API] No response (CORS, wrong URL, or server down):", error.code, url);
    }
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("getwork_token");
      localStorage.removeItem("getwork_user");
      window.dispatchEvent(new CustomEvent("getwork:auth-expired", { detail: { status } }));
    }
    return Promise.reject(error);
  }
);
