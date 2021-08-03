import Product from '../models/product.js'
import Cart from '../models/cart.js'
import WishList from '../models/wishlist.js'

export const getCartList = async(req, res) => {
  try {
    const cart = await Cart.find({user: {_id: req.userData._id}}).populate('products').populate('user')
    if(!cart) {
      return res.status(404).json({success: false, message: "cart list not found"});
    }
    return res.status(200).json({success: true, message: "retrieved cart list", result: cart});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
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
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}
  

export const addProductToCart = async(req, res) => {
  const {productId} = req.params
  try {
    const user = req.userData
    const products = await Product.findById(productId)
    const userExists = await Cart.findOne({user: {_id: user._id}})
    if (!userExists) {
      const cart = await Cart.create({
        user,
        products
  
      });
      if(!cart) {
        return res.status(404).json({success: false, message: "new cart not created"});
      }
      return res.status(201).json({success: true, message: "new cart created with one product", result: cart});
    }
    const productExists = await Cart.findOne({products: {_id: productId}})
    if(!productExists) {
      const newProduct = await Cart.findOneAndUpdate(
        {user: {_id: user._id}},
        { $push: { products: products } },
        {new: true}
      )
      if(!newProduct) {
        return res.status(404).json({success: false, message: "new product not added to cart"});
      }
      return res.status(201).json({success: true, message: "new product added to cart", result: newProduct});
      
    }
    return res.status(409).json({success: false, message: "This product already exists in the cart"});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}

export const updateProductDetails = async(req, res) => {
  try {
    const {size, quantity} = req.query
    const Quantity = parseInt(quantity)
    const { productId }= req.params;
    const updatedProductDetails = await Cart.findOneAndUpdate(
      {user: {_id: req.userData._id}, products: {_id: productId}},
      { $set:  {'products.$.size': size, 'products.$.quantity': Quantity} }, 
      { new : true }
    ).populate('products');
    if(!updatedProductDetails) {
      return res.status(404).json({success: false, message: "product details not updated"});
    }
    return res.status(201).json({success: true, message: "product details updated", result: updatedProductDetails});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}

export const deleteProductFromCart = async(req, res) => {
  try {
    const {productId} = req.params
    const deletedProduct = await Cart.findOneAndDelete({'user._id': req.userData._id, 'products._id': productId})
    if(!deletedProduct) {
      return res.status(404).json({success: false, message: "product not deleted from cart"});
    }
    return res.status(200).json({success: true, message: "product deleted from cart", result: deletedProduct});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}

export const moveProductToWishList = async(req, res) => {
  try {
    const {productId} = req.params
    const removedProduct = await Cart.findOneAndDelete({'user._id': req.userData._id, 'products._id': productId})
    const movedProduct = await WishList.findOneAndUpdate(
      {user: {_id: req.userData._id}},
      { $push: { products: removedProduct } }
    )
    if(!movedProduct) {
      return res.status(404).json({success: false, message: "product not moved to wishlist"});
    }
    return res.status(200).json({success: true, message: "product moved to wishlist", result: movedProduct});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}