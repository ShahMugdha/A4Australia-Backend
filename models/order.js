import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  orderHistory: [{
    paymentIntentId:Object,
    order : [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      }, 
      size: {
        type: String,
        enum: ["Small", "Medium", "Large"]
      },
      quantity: {
        type: Number,
        default: 1
      },
      price: {
        type: Number,
        default: 0
      }
    }], 
    date: Date
  }],
  totalQuantity: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
})

const Order = mongoose.model('order', orderSchema);
export default Order;