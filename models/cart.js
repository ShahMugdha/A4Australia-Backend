import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      unique: true
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large"]
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: Number
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
  }
}, {
  timestamps: true,
})

const Cart = mongoose.model('cart', cartSchema);
export default Cart;