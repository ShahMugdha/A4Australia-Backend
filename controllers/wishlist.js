import Product from '../models/product.js'
import User from '../models/user.js'
import Cart from '../models/cart.js'
import WishList from '../models/wishlist.js'

export const getWishList = async(req, res) => {
  try {
    const wishlist = await WishList.find().populate('products').populate('user')
    if(!wishlist) {
      return res.status(404).json({success: false, message: "wishlist list not found"});
    }
    return res.status(200).json({success: true, message: "retrieved wishlist list", result: wishlist});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const getParticularProduct = async(req, res) => {
  try {
    const {prodTitle} = req.params;
    const product = await Product.findOne({title: prodTitle})
    if(!product) {
      return res.status(404).json({success: false, message: "product by this title not found"});
    }
    return res.status(200).json({success: true, message: "retrieved product by title", result: product});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}
  

export const addProductToWishList = async(req, res) => {
  const {productId} = req.params
  try {
    const userData = req.userData
    const user = await User.findById(userData._id)
    const products = await Product.findById(productId)
    const userExists = await WishList.findOne({user: {_id: userData._id}})
    console.log(userExists, "user")
    if (!userExists) {
      const wishlist = await WishList.create({
        user,
        products
      });
      if(!wishlist) {
        return res.status(404).json({success: false, message: "new wishlist not created"});
      }
      return res.status(201).json({success: true, message: "new wishlist created with one product", result: wishlist});
    }
    const productExists = await WishList.findOne({user: {_id: userData._id}, products: productId})
    console.log(productExists, "product exists")
    if(!productExists) {
      const newProduct = await WishList.findOneAndUpdate(
        {user: {_id: userData._id}},
        { $push: { products: products } }
      )
      if(!newProduct) {
        return res.status(404).json({success: false, message: "new product not added to wishlist"});
      }
      return res.status(201).json({success: true, message: "new product added to wishlist", result: newProduct});
      
    }
    return res.status(409).json({success: false, message: "This product already exists in the wishlist"});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const deleteProductFromWishList = async(req, res) => {
  try {
    const {productId} = req.params
    const deletedProduct = await WishList.findOneAndDelete({user: {_id: req.userData._id}, 'products._id': productId})
    if(!deletedProduct) {
      return res.status(404).json({success: false, message: "product not deleted from wishlist"});
    }
    return res.status(200).json({success: true, message: "product deleted from wishlist", result: deletedProduct});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const moveProductToCart = async(req, res) => {
  try {
    const {productId} = req.params
    const selectedProduct = await WishList.findOneAndUpdate(
      {user: {_id: req.userData._id}},
      {$pull: { products: productId}}
    ).populate('products')
    if(!selectedProduct) {
      return res.status(404).json({success: false, message: "product not deleted from wishlist"});
    }
    const product = await Product.findById(productId)
    console.log(product, "product in db")
    if(!product) {
      return res.status(404).json({success: false, message: "product not found in database"});
    }
    const movedProduct = await Cart.findOneAndUpdate(
      {user: {_id: req.userData._id}},
      {$push: { products: product }},
      {new: true}
    ).populate('products')
    console.log(movedProduct, "moved product in cart")
    if(!movedProduct) {
      return res.status(404).json({success: false, message: "product not moved to cart"});
    }
    return res.status(200).json({success: true, message: "product deleted from wishlist and moved to cart", result: movedProduct});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}