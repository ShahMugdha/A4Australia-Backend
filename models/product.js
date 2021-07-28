import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    unique: true
  },
  imageUrl: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Boys', 'Girls']
  },
  subCategory: {
    type: String
  },
  size: {
    type: String
  },
  price: {
    type: Number
  }
}, {
  timestamps: true
});

const Product = mongoose.model('product', productSchema);
export default Product;
