import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
  getMyOrder,
  getCustomerOrder,
  createOrder,
  getAllOrders
} from '../controllers/order.js';

router.post('/', verifyToken, createOrder);
router.get('/my-order', verifyToken, getMyOrder);
router.get('/:userId', verifyToken, verifyAdmin, getCustomerOrder);
router.get('/all-orders', verifyToken, verifyAdmin, getAllOrders);

export default router;