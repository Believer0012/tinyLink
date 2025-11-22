import { HealthService } from "../services/health.service.js";

export const HealthController = {
  getHealth(req, res) {
    try {
      const data = HealthService.getHealth();
      return res.json(data);
    } catch (err) {
      console.error("Healthcheck error:", err);
      return res.status(500).json({ status: "error", message: "Healthcheck failed" });
    }
  },
};
