import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getCartList,
  getParticularProduct,
  addProductToCart,
  updateProductSize,
  updateProductQuantity,
  deleteProductFromCart,
  moveProductToWishList,
  deleteCart
} from '../controllers/cart.js';

router.post('/:productId/:size', verifyToken, addProductToCart);
router.patch('/update-product-size/:productId/:originalSize/:updatedSize', verifyToken, updateProductSize);
router.patch('/update-product-quantity/:productId/:size/:quantity', verifyToken, updateProductQuantity);
router.get('/', verifyToken, getCartList);
router.patch('/remove-product/:productId/:size', verifyToken, deleteProductFromCart);
router.patch('/move-to-wishlist/:productId/:size', verifyToken, moveProductToWishList);
router.delete('/', verifyToken, deleteCart)
router.get('/:productId', verifyToken, getParticularProduct);

export default router;