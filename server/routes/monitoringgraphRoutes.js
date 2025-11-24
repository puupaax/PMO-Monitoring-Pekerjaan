// routes/monitoringHistoryRoutes.js
import { Router } from "express";
import {
  getSummary,
  getDeviasiPerProject,
  getProblemPie,
  getTrends,
} from "../controllers/monitoringgraphController.js";
import { requireAuth } from "@clerk/express";

const router = Router();

router.get("/summary", requireAuth(), getSummary);
router.get("/deviasi", requireAuth(), getDeviasiPerProject);
router.get("/problem-pie", requireAuth(), getProblemPie);
router.get("/trends", requireAuth(), getTrends);

export default router;
