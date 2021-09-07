import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
  getInventoryList,
  getParticularProductInventory,
  addProductInventory,
  updateInventoryStock,
  deleteProductInventory
} from '../controllers/inventory.js';

router.post('/:productId', verifyToken, verifyAdmin, addProductInventory);
router.get('/', verifyToken, getInventoryList);
router.get('/:productId', verifyToken, getParticularProductInventory);
router.patch('/:productId', verifyToken, verifyAdmin, updateInventoryStock);
router.delete('/:productId', verifyToken, verifyAdmin, deleteProductInventory);

export default router;