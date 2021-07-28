import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {getUserProfile} from "../controllers/profile.js"

router.get('/', verifyToken, getUserProfile);

export default router;