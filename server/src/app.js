import express from "express";
import cors from "cors";
import linkRoutes from "./routes/link.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Important for Railway — ROOT ENDPOINT
app.get("/", (req, res) => {
  res.send("TinyLink backend is running");
});

app.use("/api", linkRoutes);
app.use("/healthz", healthRoutes);

export default app;
