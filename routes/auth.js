import express from "express";
import {
    login,
    signUp
} from "../controllers/auth.js";
/* import {
    loginValidation, inviteUserValidation, acceptInvitationValidation,
    updatePasswordValidation, forgotPasswordValidation, verifyOtpValidation,
    changePasswordValidation
} from "../utils/validation/requestValidation.js"; */
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

//sign up user
router.post('/signup', signUp)

// for login user
router.post("/login", login);


export default router;