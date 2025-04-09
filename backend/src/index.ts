import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import messagesRoutes from "./routes/message.route";

import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
