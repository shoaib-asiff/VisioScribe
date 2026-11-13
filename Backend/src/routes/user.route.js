import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  getUserHistory,
  login,
  logout,
  otpGetter,
  otpVerify,
  refreshTokens,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyTokens } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register-user").post(registerUser);
router.route("/login").post(login);
router.route("/forget-password").patch(changePassword);
router.route("/otp-get").post(otpGetter);
router.route("/otp-verify").post(otpVerify);

//Protected Routes
router.route("/current-user").get(verifyTokens, getCurrentUser);
router.route("/refresh-tokens").get(verifyTokens, refreshTokens);
router.route("/logout").get(verifyTokens, logout);
router.route("/user-history").get(verifyTokens, getUserHistory);

export default router;
