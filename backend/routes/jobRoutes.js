import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import * as jobController from "../controllers/jobController.js";
import { uploadProofMiddleware } from "../middleware/uploadProof.js";

const router = Router();

router.post("/create", protect, requireRole("JobGiver"), jobController.createJob);
router.get("/", protect, jobController.listJobs);
router.post("/apply/:jobId", protect, requireRole("Worker"), jobController.applyJob);
router.post("/accept/:jobId", protect, requireRole("JobGiver"), jobController.acceptJob);
router.post(
  "/upload-proof",
  protect,
  requireRole("Worker"),
  uploadProofMiddleware.single("proof"),
  jobController.uploadProof
);
router.post("/approve", protect, requireRole("JobGiver"), jobController.approveJob);
router.get("/:id", protect, jobController.getJobById);

export default router;
