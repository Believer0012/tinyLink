import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import LinkRoutes from "./routes/link.routes.js";
import healthRoutes from "./routes/health.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", LinkRoutes);
app.use("/", healthRoutes);

// Redirect (must be last)
app.use("/", LinkRoutes);

export default app;
