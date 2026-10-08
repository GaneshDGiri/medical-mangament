/**
 * MediCare AI - Full-Stack Express Server with Socket.IO (JavaScript)
 */

import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { apiRouter, setSocketIO } from "./server/routes/apiRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  // Socket.IO configuration
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Attach socket instance to apiRouter
  setSocketIO(io);

  io.on("connection", (socket) => {
    socket.on("join", ({ userId, role }) => {
      if (userId) socket.join(userId);
      if (role) socket.join(role);
    });

    socket.on("disconnect", () => {
      // Disconnected cleanly
    });
  });

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // REST API Router
  app.use("/api", apiRouter);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      system: "MediCare AI — Smart Hospital Management System",
      engine: "JavaScript Node.js + Socket.IO",
      timestamp: new Date().toISOString()
    });
  });

  // Vite Dev Server Middleware or Static Production Build
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
        watch: process.env.DISABLE_HMR === "true" ? null : {}
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[MediCare AI Server] JavaScript runtime with Socket.IO live on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start MediCare AI server:", err);
  process.exit(1);
});
