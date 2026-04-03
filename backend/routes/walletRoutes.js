import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as walletController from "../controllers/walletController.js";

const router = Router();

router.post("/add", protect, walletController.addFunds);
router.get("/", protect, walletController.getWallet);
router.get("/transactions", protect, walletController.listTransactions);

export default router;
