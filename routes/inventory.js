import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getInventoryList,
  getParticularProductInventory,
  addProductInventory,
  updateInventoryStock
} from '../controllers/inventory.js';

router.post('/:productId', verifyToken, addProductInventory);
router.get('/', verifyToken, getInventoryList);
router.get('/:productId', verifyToken, getParticularProductInventory);
router.patch('/:productId/:size', verifyToken, updateInventoryStock);

export default router;