import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import workersRoutes from "./routes/workersRoutes.js";
import { ApiError } from "./utils/ApiError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("trust proxy", 1);

function parseAllowedOrigins() {
  const raw = [process.env.CORS_ORIGIN, process.env.FRONTEND_URL]
    .filter(Boolean)
    .join(",");
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set(list)];
}

const corsAllowedList = parseAllowedOrigins();
const allowVercelPreviews =
  process.env.CORS_ALLOW_VERCEL === "1" ||
  process.env.CORS_ALLOW_VERCEL === "true";

function isVercelPreviewOrigin(origin) {
  try {
    const u = new URL(origin);
    return u.protocol === "https:" && u.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (corsAllowedList.length === 0) {
        console.warn(
          "[GetWork CORS] No CORS_ORIGIN or FRONTEND_URL set — reflecting request Origin (set explicit origins in production)."
        );
        return callback(null, true);
      }
      if (corsAllowedList.includes(origin)) {
        return callback(null, true);
      }
      if (allowVercelPreviews && isVercelPreviewOrigin(origin)) {
        return callback(null, true);
      }
      console.warn(`[GetWork CORS] Blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 204,
  })
);

if (corsAllowedList.length) {
  console.log("[GetWork CORS] Allowed origins:", corsAllowedList.join(", "));
}
if (allowVercelPreviews) {
  console.log("[GetWork CORS] Also allowing https://*.vercel.app (CORS_ALLOW_VERCEL)");
}

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, service: "GetWork API", status: "ok" });
});

app.use((req, res, next) => {
  const started = Date.now();
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.warn(
        `[GetWork API] ${res.statusCode} ${req.method} ${req.originalUrl} (${Date.now() - started}ms)`
      );
    }
  });
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/workers", workersRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Upload error",
    });
  }
  if (err.message === "Only image uploads are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && err.stack && { stack: err.stack }),
  });
});

const port = Number(process.env.PORT) || 5000;

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`GetWork server listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
