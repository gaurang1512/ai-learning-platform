import express from "express";
import {
  registerUser,
  registerTeacher,
  registerStudent,
  verifyEmail,
  loginUser,
  verifyOtp,
  myProfile,
  refreshToken,
  logOutUser,
  adminController,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";
import { isRole } from "../middleware/isRole.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register/teacher", registerTeacher);
router.post("/register/student", registerStudent);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.get("/me", isAuth, myProfile);
router.post("/refresh", refreshToken);
router.post("/logout", isAuth, logOutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.get("/admin", isAuth, adminController);
router.get("/teacher/dashboard", isAuth, isRole("teacher"), (req, res) =>
  res.json({ message: "Welcome Teacher!" }),
);
router.get("/student/dashboard", isAuth, isRole("student"), (req, res) =>
  res.json({ message: "Welcome Student!" }),
);
export default router;

