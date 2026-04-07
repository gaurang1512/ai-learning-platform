import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

// ── Database ──────────────────────────────────────────
await connectDB();

// ── Redis ─────────────────────────────────────────────
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error("❌ Missing REDIS_URL in environment variables");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("❌ Redis max retries reached. Giving up.");
        return new Error("Max retries reached");
      }
      const delay = retries * 500;
      console.log(
        `🔄 Redis reconnecting in ${delay}ms... (attempt ${retries})`,
      );
      return delay;
    },
    keepAlive: 30000,
    tls: redisUrl.startsWith("rediss://"), // enable TLS for Upstash
  },
});

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("ready", () => console.log("✅ Redis ready"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));
redisClient.on("end", async () => {
  console.warn("⚠️ Redis connection closed. Attempting reconnect...");
  try {
    await redisClient.connect();
  } catch (e) {
    console.error("❌ Redis reconnect failed:", e.message);
  }
});

try {
  await redisClient.connect();
} catch (err) {
  console.error("❌ Failed to connect to Redis on startup:", err.message);
  process.exit(1);
}

// ── Express App ───────────────────────────────────────
const app = express();

// ── Middlewares ───────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── JSON Parse Error Handler ──────────────────────────
app.use((err, req, res, next) => {
  if (
    err?.type === "entity.parse.failed" ||
    (err instanceof SyntaxError && err.status === 400 && "body" in err)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid JSON payload", error: err.message });
  }
  return next(err);
});

// ── Health Check (useful after hosting) ──────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    redis: redisClient.isReady ? "connected" : "disconnected",
  });
});

// ── Routes ────────────────────────────────────────────
import userRoutes from "./routes/user.js";
import learningPathRoutes from "./routes/LearningPath.js";

app.use("/api/v1", userRoutes);
app.use("/api/v1", learningPathRoutes);

// ── Global Error Handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── Start Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
