import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getCartList,
  getParticularProduct,
  addProductToCart,
  updateProductDetails,
  deleteProductFromCart
} from '../controllers/cart.js';

router.post('/:productId', verifyToken, addProductToCart);
router.patch('/:productId/:size', verifyToken, updateProductDetails);
router.get('/', verifyToken, getCartList);
router.delete('/cartId/:productId', verifyToken, deleteProductFromCart);
router.get('/:prodTitle', verifyToken, getParticularProduct);

export default router;