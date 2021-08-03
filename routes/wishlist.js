import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getWishList,
  getParticularProduct,
  addProductToWishList,
  deleteProductFromWishList,
  moveProductToCart
} from '../controllers/wishlist.js';

router.post('/:productId', verifyToken, addProductToWishList);
router.get('/', verifyToken, getWishList);
router.delete('/:productId', verifyToken, deleteProductFromWishList);
router.get('/:prodTitle', verifyToken, getParticularProduct);
router.post('/move-to-cart/:productId/:size', verifyToken, moveProductToCart);

export default router;