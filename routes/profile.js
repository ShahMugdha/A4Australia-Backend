import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {getUserProfile, updateUserAccountDetails} from "../controllers/profile.js"

router.get('/', verifyToken, getUserProfile);
router.patch('/account-details', verifyToken, updateUserAccountDetails);

export default router;