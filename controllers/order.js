import Cart from '../models/cart.js'
import Order from '../models/order.js'

export const getMyOrder = async(req, res) => {
  try {
    const order = await Order.findOne({user: req.userData}).populate('user').populate('orderHistory.order.product')
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
    const paymentIntentId = req.params
    const order = await Order.findOne({orderHistory: {$elemMatch: {paymentIntentId}}}, {"orderHistory.$": 1}).populate('user').populate('orderHistory.order.product')
    if(!order) {
      return res.status(404).json({success: false, message: "order not found"});
    }
    return res.status(200).json({success: true, message: "retrieved order", result: order});
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
    const paymentIntentId = req.params
    const cart = await Cart.findOne({user: req.userData})
    const userOrderExists = await Order.findOne({user: req.userData})
    if (cart && !userOrderExists) {
      console.log("hi")
      const orderCreate = await Order.create({
        user: req.userData,
        orderHistory: {paymentIntentId, order: cart.cart, date: new Date()},
        totalPrice: cart.totalPrice,
        totalQuantity: cart.totalQuantity
      });
      console.log(orderCreate, "order created")
      if(!orderCreate) {
        return res.status(404).json({success: false, message: "order not created"});
      } 
      return res.status(201).json({success: true, message: "order created", result: orderCreate }); 
    }

    else if(cart && userOrderExists) {
      const newOrder = await Order.findOneAndUpdate(
        {user: req.userData},
        {$addToSet: {orderHistory: {
          paymentIntentId, order: cart.cart, date: new Date()}}, 
          $inc: {totalQuantity: cart.totalQuantity, totalPrice: cart.totalPrice}
        },
        {new: true}
      )
      if(!newOrder) {
        return res.status(404).json({success: false, message: "new order not added"});
      }
      return res.status(201).json({success: true, message: "new order added", result: newOrder});
    }

    else if(!cart) return res.status(409).json({success: false, message: "cart doesn't exist"});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}