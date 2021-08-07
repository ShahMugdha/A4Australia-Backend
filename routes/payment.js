import express from 'express';
const router = express.Router();

import {verifyToken} from "../middleware/verifyToken.js";
import {
  createPaymentIntent
} from '../controllers/payment.js';

router.post('/pay', createPaymentIntent);

export default router;