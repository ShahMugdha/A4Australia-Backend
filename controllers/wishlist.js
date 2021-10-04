import Product from '../models/product.js'
import Inventory from '../models/inventory.js'
import User from '../models/user.js'
import Cart from '../models/cart.js'
import WishList from '../models/wishlist.js'

export const getWishList = async(req, res) => {
  try {
    const wishlist = await WishList.find({user: {_id: req.userData._id}}).populate('products').populate('user')
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
        {$push: {products: products }},
        {new: true}
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
    const deletedProduct = await WishList.findOneAndUpdate(
      {user: {_id: req.userData._id}, products: productId},
      {$pull: {products: productId}},
      {new: true}
    )
    console.log(deletedProduct, "deleted")
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
    const {productId, size} = req.params
    const sizeCheck = await Inventory.findOne({product: {_id: productId}, stock: {$elemMatch: {size, quantity: {$gt:0}}}}).populate('product')
    if(!sizeCheck) {
      return res.status(404).json({success: false, message: "product of this size out of stock"});
    }
    const existingCart = await Cart.findOne({user: {_id: req.userData._id}})
    console.log(existingCart, "cart exist")
    if(!existingCart) {
      const product = await Product.findById(productId)
      const createdCart = await Cart.create({
        user: req.userData,
        cart: {product: {_id: productId}, size, price: product.price}
      })
      if(!createdCart) {
        return res.status(404).json({success: false, message: "your cart is still empty"});
      }
      console.log(createdCart, "cart create")
      //return res.status(201).json({success: true, message: "moved the first product with size to cart", result: createdCart});
      const updatedCart = await Cart.findOneAndUpdate(
        {user: req.userData},
        {$inc: {totalQuantity: 1, totalPrice: product.price}},
        {new: true}
      ).populate('products')
      console.log(updatedCart, "cart updated with total quantity after creation")
      if(!updatedCart) {
        return res.status(404).json({success: false, message: "cart not updated after creation"});
      }
      
      const selectedProduct = await WishList.findOneAndUpdate(
        {user: {_id: req.userData._id}},
        {$pull: { products: productId}}
      ).populate('products')
      console.log(selectedProduct, "deleted from wishlist after cart create")
      if(!selectedProduct) {
        return res.status(404).json({success: false, message: "product not deleted from wishlist after cart create"});
      }
      return res.status(200).json({success: true, message: "product deleted from wishlist and moved to cart create", result: updatedCart});
    }
    
    const existingProductWithSize = await Cart.findOne({user: req.userData, cart: {$elemMatch: {product: {_id: productId}, size}}})
    console.log(existingProductWithSize, "product with same size")
    if(existingProductWithSize) {
      return res.status(400).json({success: false, message: `product with ${size} size already exists in cart`});
    }

    const product = await Product.findById(productId)
    const movedProduct = await Cart.findOneAndUpdate(
      {user: {_id: req.userData._id}},
      {$push: { cart: {product: {_id: productId}, size, price: product.price}}},
      {new: true}
    ).populate('products')
    console.log(movedProduct, "moved product in cart")

    if(!movedProduct) {
      return res.status(404).json({success: false, message: "product not moved to cart"});
    }
    
    const updatedCart = await Cart.findOneAndUpdate(
      {user: req.userData},
      {$inc: {totalQuantity: 1, totalPrice: product.price}},
      {new: true}
    ).populate('products')
    console.log(updatedCart, "cart updated with total quantity")
    if(!updatedCart) {
      return res.status(404).json({success: false, message: "cart not updated"});
    }
    
    const selectedProduct = await WishList.findOneAndUpdate(
      {user: {_id: req.userData._id}},
      {$pull: { products: productId}}
    ).populate('products')
    console.log(selectedProduct, "deleted from wishlist")
    if(!selectedProduct) {
      return res.status(404).json({success: false, message: "product not deleted from wishlist"});
    }
    return res.status(200).json({success: true, message: "product deleted from wishlist and moved to cart", result: updatedCart});
    
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}