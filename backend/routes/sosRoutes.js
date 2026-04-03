import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as sosController from "../controllers/sosController.js";

const router = Router();

router.post("/", protect, sosController.createSOS);

export default router;
