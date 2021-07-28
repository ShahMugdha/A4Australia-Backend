import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    unique: true
  }],
  totalQuantity: {
    type: Number
  },
  totalPrice: {
    type: Number
  },
  priceWithGST: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
}, {
  timestamps: true,
})

const Cart = mongoose.model('cart', cartSchema);
export default Cart;