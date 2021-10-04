import Product from '../models/product.js'
import Cart from '../models/cart.js'
import Order from '../models/order.js'

export const getMyOrder = async(req, res) => {
  try {
    const order = await Order.findOne({user: req.userData}).populate('user').populate('order.product')
    if(!order) {
      return res.status(404).json({success: false, message: "order not found"});
    }
    return res.status(200).json({success: true, message: "retrieved order", result: order});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const getCustomerOrder = async(req, res) => {
  try {
    const userId = req.params
    const order = await Order.findOne({user: {_id: userId}}).populate('user').populate('order.product')
    if(!order) {
      return res.status(404).json({success: false, message: "order not found"});
    }
    return res.status(200).json({success: true, message: "retrieved order", result: cart});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const getAllOrders = async(req, res) => {
  try {
    const order = await Order.find({})
    if(!order) {
      return res.status(404).json({success: false, message: "orders not found"});
    }
    return res.status(200).json({success: true, message: "retrieved all orders", result: order});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}
  

export const createOrder = async(req, res) => {
  try {
    const user = req.userData
    const cart = await Cart.findOne({user})
    const userOrderExists = await Order.findOne({user})
    if (cart && !userOrderExists) {
      const order = await Order.create({
        user,
        orderHistory:{order: cart.cart},
        totalPrice: cart.totalPrice,
        totalQuantity: cart.totalQuantity
      });
      if(!order) {
        return res.status(404).json({success: false, message: "order not created"});
      }
      return res.status(201).json({success: true, message: "order created", result: order});
    }

    if(cart && userOrderExists) {
      const newOrder = await Order.findOneAndUpdate(
        {user: req.userData},
        {$addToSet: {orderHistory: {order: cart.cart}}, $inc: {totalQuantity: cart.totalQuantity, totalPrice: cart.totalPrice}},
        {new: true}
      )
      if(!newOrder) {
        return res.status(404).json({success: false, message: "new order not added"});
      }
      return res.status(201).json({success: true, message: "new order added", result: newOrder});
    }
    return res.status(409).json({success: false, message: "cart doesn't exist"});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}