import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as chatController from "../controllers/chatController.js";

const router = Router();

router.post("/send", protect, chatController.sendMessage);
router.get("/:jobId", protect, chatController.getMessagesForJob);

export default router;
