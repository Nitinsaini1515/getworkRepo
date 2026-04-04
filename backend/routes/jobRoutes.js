import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import * as jobController from "../controllers/jobController.js";
import { uploadCompletionMiddleware } from "../middleware/uploadProof.js";

const router = Router();

router.post("/create", protect, requireRole("JobGiver"), jobController.createJob);
router.get("/", protect, jobController.listJobs);
router.get("/applied", protect, requireRole("Worker"), jobController.listAppliedJobs);
router.post("/apply/:jobId", protect, requireRole("Worker"), jobController.applyJob);
router.post("/accept/:jobId", protect, requireRole("JobGiver"), jobController.acceptJob);
router.post("/start/:jobId", protect, requireRole("Worker"), jobController.startJob);
router.post(
  "/complete/:jobId",
  protect,
  requireRole("Worker"),
  uploadCompletionMiddleware.array("photos", 12),
  jobController.completeJob
);
router.get("/:id", protect, jobController.getJobById);

export default router;
