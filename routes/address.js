import express from 'express';
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import { addressValidation } from '../utils/validation/address.js';
import {
  addAddress,
  updateAddress,
  getAllAddresses,
  getMyAddress,
  removeAddress 
} from '../controllers/address.js';

router.put('/', verifyToken, addressValidation, addAddress);
router.patch('/my-address/update/:addressId', verifyToken, addressValidation, updateAddress);
router.get('/', verifyToken, getAllAddresses);
router.patch('/my-address/remove/:addressId', verifyToken, removeAddress);
router.get('/my-address', verifyToken, getMyAddress); 

export default router;