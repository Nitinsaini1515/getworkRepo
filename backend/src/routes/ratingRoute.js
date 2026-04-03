
import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { deleteReview, editReview, giveRating } from "../controllers/ratingController.js";



const router = Router()

router.route("/giverating").post(verifyJWT,giveRating)
router.route("/deletereview").post(verifyJWT,deleteReview)
router.route("/editreview").post(verifyJWT,editReview)
export default router
