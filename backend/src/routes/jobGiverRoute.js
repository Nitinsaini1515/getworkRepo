import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { deleteJob, editJob, postJob } from "../controllers/jobGiverController.js";



const router = Router();
router.route("/postjobs").post(verifyJWT,postJob)
router.route("/editjob/:jobId").post(verifyJWT,editJob)
router.route("/deletejob/:jobId").post(verifyJWT,deleteJob)

export default router