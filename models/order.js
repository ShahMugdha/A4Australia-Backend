import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'Not processed',
    enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
}, {
  timestamps: true,
})

const Order = mongoose.model('order', orderSchema);
export default Order;