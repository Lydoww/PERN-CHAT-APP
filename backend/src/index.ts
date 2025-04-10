import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import messagesRoutes from "./routes/message.route";
import { app, server } from "./socket/socket";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
