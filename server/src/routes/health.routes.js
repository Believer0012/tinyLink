import express from "express";
import { HealthController } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/getHealthz", HealthController.getHealth);

export default router;
