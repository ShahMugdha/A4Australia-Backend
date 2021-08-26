//const mailgun = require('../../services/mailgun');
//const taxConfig = require('../../config/tax');

import Order from '../models/order.js'
import Cart from '../models/cart.js'
import Product from '../models/product.js'

export const createOrder = async(req, res) => {
  try {
    const {cartId, total} = req.body
    const user = req.userData
    const foundCart = await Cart.findOne({ _id: order.cart });
    const order = await Order.create({
      cart: cartId,
      user,
      total
    });
    if(!order) {
      res.status(404).json({success: false, message: "order not placed"})
    }
    res.status(201).json({success: true, message: "order placed", result: order})

    const addedOrder = await Order.findById(order._id).populate('cart', 'user', '-password');
    console.log(addedOrder)
    await Product.updateMany(
      { _id: foundCart.products },
      { $dec: { quantity: 1 } }
    );

    const cartDoc = await Cart.findById(order.cart._id).populate('products')

    const newOrder = {
      _id: order._id,
      user: order.user,
      total: order.total,
      products: cartDoc.products
    };
    //await mailgun.sendEmail(order.user.email, 'order-confirmation', newOrder);
  } 
  catch (error) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}

export const getOrder = async(req, res) => {
  try {
    const orderId = req.params.orderId;
    const user = req.user._id;

    const orderDoc = await Order.findOne({ _id: orderId, user }).populate({
      path: 'cart'
    });

    if (!orderDoc) {
      res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    const cart = await Cart.findById(orderDoc.cart._id).populate({
      path: 'products.product',
      populate: {
        path: 'brand'
      }
    });

    let order = {
      _id: orderDoc._id,
      cartId: orderDoc.cart._id,
      total: orderDoc.total,
      totalTax: 0,
      products: cart.products
    };

    order = caculateTaxAmount(order);

    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
}

export const cancelOrder = async(req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });
    const foundCart = await Cart.findOne({ _id: order.cart });

    increaseQuantity(foundCart.products);

    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: order.cart });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
}

export const cancelItem = async(req, res) => {
  try {
    const itemId = req.params.itemId;
    const orderId = req.body.orderId;
    const cartId = req.body.cartId;

    const foundCart = await Cart.findOne({ 'products._id': itemId });
    const foundCartProduct = foundCart.products.find(p => p._id == itemId);

    await Cart.updateOne(
      { 'products._id': itemId },
      {
        'products.$.status': 'Cancelled'
      }
    );

    await Product.updateOne(
      { _id: foundCartProduct.product },
      { $inc: { quantity: 1 } }
    );

    const cart = await Cart.findOne({ _id: cartId });
    const items = cart.products.filter(item => item.status === 'Cancelled');

    // All items are cancelled => Cancel order
    if (cart.products.length === items.length) {
      await Order.deleteOne({ _id: orderId });
      await Cart.deleteOne({ _id: cartId });

      return res.status(200).json({
        success: true,
        orderCancelled: true,
        message: 'You order has been cancelled successfully!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item has been cancelled successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
}