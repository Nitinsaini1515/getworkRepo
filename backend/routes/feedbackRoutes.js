import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as feedbackController from "../controllers/feedbackController.js";

const router = Router();

router.post("/", protect, feedbackController.submitFeedback);
router.get("/:userId", protect, feedbackController.listFeedbackForUser);

export default router;
