import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.route";
import messagesRoutes from "./routes/message.route";
import { app, server } from "./socket/socket";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const rootDir = path.resolve();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(rootDir, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
