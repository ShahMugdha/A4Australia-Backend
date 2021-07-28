import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }]
}, {
  timestamps: true,
})

const Wishlist = mongoose.model('wishlist', wishlistSchema);
export default Wishlist;