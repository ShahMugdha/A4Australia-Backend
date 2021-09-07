import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

import {
  createOrder,
  getOrder,
  cancelOrder,
  cancelItem,
  dashboard
} from '../controllers/order.js'

router.post('/create', verifyToken, createOrder)
router.get('/:orderId', verifyToken, getOrder)
router.delete('/cancel/:orderId', verifyToken, cancelOrder)
router.put('/cancel/item/:itemId', verifyToken, cancelItem)
router.get('/', verifyToken, verifyAdmin, dashboard)

export default router