import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getProductList,
  getProductsByCategory,
  getProductsBySubCategory,
  getParticularProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.js';

router.post('/', verifyToken, addProduct);
router.patch('/:productId', verifyToken, updateProduct);
router.get('/', getProductList);
router.delete('/:productId', verifyToken, deleteProduct);
router.get('/:category', getProductsByCategory);
router.get('/:subCategory', getProductsBySubCategory);
router.get('/:prodTitle', getParticularProduct);

export default router;