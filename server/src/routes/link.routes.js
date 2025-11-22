import express from "express";
import { LinkController } from "../controllers/link.controller.js";

const router = express.Router();

// REST API
router.post("/links", LinkController.create);
router.get("/links", LinkController.getAll);
router.get("/links/:code", LinkController.getOne);
router.delete("/links/:code", LinkController.remove);

// redirect route
router.get("/:code", LinkController.redirect);

export default router;
