import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

import {
  paymentIntentsList,
  paymentIntentById
} from '../controllers/transaction.js'

router.get('/all-transactions', verifyToken, verifyAdmin, paymentIntentsList)
router.get('/:paymentIntentId', verifyToken, verifyAdmin, paymentIntentById)

export default router