import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import * as workerController from "../controllers/workerController.js";

const router = Router();

router.get(
  "/available",
  protect,
  requireRole("JobGiver"),
  workerController.listAvailableWorkers
);
router.patch("/availability", protect, requireRole("Worker"), workerController.setAvailability);
router.patch(
  "/profile",
  protect,
  requireRole("Worker"),
  workerController.updateWorkerProfile
);

export default router;
