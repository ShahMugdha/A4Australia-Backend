import Product from '../models/product.js'
import Inventory from '../models/inventory.js'

export const getInventoryList = async(req, res) => {
  try {
    const inventoryList = await Inventory.find()
    if(!inventoryList) {
      return res.status(404).json({success: false, message: "inventory list not found"});
    }
    return res.status(200).json({success: true, message: "retrieved inventory list", result: inventoryList});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}

export const getParticularProductInventory = async(req, res) => {
  try {
    const {productId} = req.params;
    const inventory = await Inventory.findOne({product: {_id: productId}}).populate('product')
    if(!inventory) {
      return res.status(404).json({success: false, message: "product inventory by this id not found"});
    }
    return res.status(200).json({success: true, message: "retrieved product inventory by id", result: inventory});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const addProductInventory = async(req, res) => {
  try {
    const {productId} = req.params
    const {
      size,
      quantity
    } = req.body

    const existingInventory = await Inventory.findOne({product: {_id: productId}})
    if(!existingInventory) {
      const createdInventory = await Inventory.create({
        product: {_id: productId},
        stock: {size, quantity}
      });
      if(!createdInventory) {
        return res.status(404).json({success: false, message: "inventory not created"});
      }
      return res.status(201).json({success: true, message: "inventory created", result: createdInventory});
    }

    const existingStock = await Inventory.findOne({product: {_id: productId}, stock: {size, quantity}}) 
    if(existingStock) {
      return res.status(404).json({success: false, message: "this stock already exists"});
    }

    const newInventory = await Inventory.findOneAndUpdate(
      {product: {_id: productId}},
      {$push: {stock: {size, quantity}}},
      {new: true}
    )
    if(!newInventory) {
      return res.status(404).json({success: false, message: " new stock not added to inventory "});
    }
    return res.status(201).json({success: true, message: "new stock added to inventory", result: newInventory});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const updateInventoryStock = async(req, res) => {
  try {
    const {productId, size} = req.params
    const {quantity} = req.body

    const stock = await Inventory.findOneAndUpdate(
      {product: {_id: product}},
      { $set: inventoryData }, 
      { new : true }
    );
    if(!inventory) {
      return res.status(404).json({success: false, message: "inventory not updated"});
    }
    return res.status(201).json({success: true, message: "inventory updated", result: inventory});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}

export const deleteInventoryStock = async(req, res) => {
  try {
    const {inventoryId} = req.params
    const deletedProduct = await Product.findOneAndDelete({_id: inventoryId})
    if(!deletedProduct) {
      return res.status(404).json({success: false, message: "inventory not deleted"});
    }
    return res.status(200).json({success: true, message: "inventory deleted", result: deletedProduct});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}

export const deleteProductInventory = async(req, res) => {
  try {
    const {inventoryId} = req.params
    const deletedProduct = await Product.findOneAndDelete({_id: inventoryId})
    if(!deletedProduct) {
      return res.status(404).json({success: false, message: "inventory not deleted"});
    }
    return res.status(200).json({success: true, message: "inventory deleted", result: deletedProduct});
  }
  catch(err) {
    return res.status(500).json({success: true, message: "something went wrong", result: err});
  }
}