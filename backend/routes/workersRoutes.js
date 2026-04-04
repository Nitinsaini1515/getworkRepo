import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as workerController from "../controllers/workerController.js";

const router = Router();

router.get("/nearby", protect, workerController.nearbyWorkers);

export default router;
