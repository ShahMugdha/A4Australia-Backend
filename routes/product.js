import express from 'express';
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import upload from '../middleware/upload.js';
import {
  getProductList,
  getProductsByCategory,
  getProductsBySubCategory,
  getParticularProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.js';

router.post('/', verifyToken, verifyAdmin, upload, addProduct);
router.patch('/:productId', verifyToken, verifyAdmin, upload, updateProduct);
router.get('/', getProductList);
router.delete('/:productId', verifyToken, verifyAdmin, deleteProduct);
router.get('/:category', getProductsByCategory);
router.get('/:category/:subCategory', getProductsBySubCategory);
router.get('/collection/particular/:productId', getParticularProduct);

export default router;