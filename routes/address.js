import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addAddress,
  updateAddress,
  getAllAddresses,
  getMyAddress,
  removeAddress 
} from '../controllers/address.js';

router.post('/', verifyToken, addAddress);
router.patch('/my-address/:addressId', verifyToken, updateAddress);
router.get('/', verifyToken, getAllAddresses);
router.delete('/my-address/:addressId', verifyToken, removeAddress);
router.get('/my-address', verifyToken, getMyAddress); 

export default router;