import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route";
import messagesRoutes from "./routes/message.route";
import { initSocket } from "./socket/socket";

dotenv.config();

const app = express();
const server = http.createServer(app);
initSocket(server); // ⬅️ ici on connecte le socket.io proprement

const PORT = process.env.PORT || 5000;
const rootDir = path.resolve();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(rootDir, "frontend", "dist");
  console.log("📂 FRONTEND PATH:", frontendPath);
  app.use(express.static(frontendPath));
  console.log("🧪 Juste avant le crash");
  app.get("/*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
  console.log("✅ Route catchall enregistrée");
}

app._router.stack.forEach((layer: any) => {
  if (layer.route) {
    console.log("📦 ROUTE:", layer.route.path);
  } else if (layer.name === "router") {
    layer.handle.stack.forEach((handler: any) => {
      console.log("📦 SUB-ROUTE:", handler.route?.path);
    });
  }
});

server.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
