import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
// import uploadOnCloudinary from "../utils/cloudinary";
import {upload} from "../middlewares/multerMiddleware.js";
import {
  deleteAccount,
  login,
  logout,
  passwordChange,
  register,
  updateProfile,
} from "../controllers/userContoller.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxcount: 1 },
    {
     name: "addhar", maxcount: 1
  },
  {
 name: "shopImg", maxcount:1 
  }]), register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/passwordchnage").post(verifyJWT, passwordChange);
router.route("/updateprofile").post(verifyJWT, updateProfile);
router.route("/deleteaccount").post(verifyJWT, deleteAccount);
export default router;