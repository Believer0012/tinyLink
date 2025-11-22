import express from "express";
import { HealthController } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/healthz", HealthController.getHealth);

export default router;
