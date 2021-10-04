import express from "express";
const router = express.Router();
import {
    login,
    signUp,
    verifyEmail,
    ForgotPassword,
    changePassword,
    verifyOtp
} from "../controllers/auth.js";
import {
    loginValidation, 
    signupValidation,
    changePasswordValidation, 
    forgotPasswordValidation, 
    verifyOtpValidation
} from "../utils/validation/auth.js";

router.post('/signup', signupValidation, signUp)
router.post("/login",loginValidation, login);
router.get('/verify-email/:userId', verifyEmail)
router.patch("/forgot-password", forgotPasswordValidation, ForgotPassword);
router.patch("/verify-Otp", verifyOtpValidation, verifyOtp);
router.patch("/password", changePasswordValidation, changePassword);

export default router;