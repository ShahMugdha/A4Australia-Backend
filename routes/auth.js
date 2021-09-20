import express from "express";
import {
    login,
    signUp,
    verifyEmail,
    changePassword
} from "../controllers/auth.js";
import {
    loginValidation, signupValidation,
    changePasswordValidation, forgotPasswordValidation, verifyOtpValidation
} from "../utils/validation/auth.js";
const router = express.Router();

//sign up user
router.post('/signup', signupValidation, signUp)

// for login user
router.post("/login",loginValidation, login);
router.get('/verify-email/:userId', verifyEmail)


export default router;