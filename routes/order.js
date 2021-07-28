import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";

import {
  createOrder,
  getOrder,
  cancelOrder,
  cancelItem
} from '../controllers/order.js'

router.post('/create', verifyToken, createOrder)
router.get('/:orderId', verifyToken, getOrder)
router.delete('/cancel/:orderId', verifyToken, cancelOrder)
router.put('/cancel/item/:itemId', verifyToken, cancelItem)

export default router