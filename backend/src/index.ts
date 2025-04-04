import express from "express";
import authRoutes from "./routes/auth.route";
import messagesRoutes from "./routes/message.route";

import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
