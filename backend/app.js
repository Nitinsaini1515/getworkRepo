import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./src/routes/userRoutes.js";
import jobGiverRouter from "./src/routes/jobGiverRoute.js";
import ratingRouter from "./src/routes/ratingRoute.js";

const app = express();

const _corsList = [process.env.CORS_ORIGIN, process.env.FRONTEND_URL]
  .filter(Boolean)
  .join(",")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (_corsList.length === 0) return callback(null, true);
      if (_corsList.includes(origin)) return callback(null, true);
      console.warn(`[CORS legacy app] Blocked: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobgiver", jobGiverRouter);
app.use("/api/v1/ratingrouter", ratingRouter);

export default app;