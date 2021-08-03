import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    unique: true
  },
  stock: [{
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
      required: true
    }
  }]
}, {
  timestamps: true
});

const Inventory = mongoose.model('inventory', inventorySchema);
export default Inventory;