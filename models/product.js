import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  imageUrl: {
    type: [String]
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Boys', 'Girls']
  },
  subCategory: {
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
