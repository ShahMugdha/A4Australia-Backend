import Inventory from "../models/inventory.js";

export const getInventoryList = async (req, res) => {
  try {
    const inventoryList = await Inventory.find().populate("product");
    if (!inventoryList) {
      return res
        .status(200)
        .json({ success: false, message: "inventory list not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "retrieved inventory list",
        result: inventoryList,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};

export const getParticularProductInventory = async (req, res) => {
  try {
    const { productId, size } = req.params;
    const inventory = await Inventory.findOne({
      product: { _id: productId }, stock: {$elemMatch: {size}}
    },{ "stock.$": 1 }).populate("product");
    if (!inventory) {
      return res
        .status(200)
        .json({
          success: false,
          message: "product inventory by this id and size not found",
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "retrieved product inventory by id and size",
        result: inventory,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", result: err });
  }
};

export const addProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, quantity } = req.body;

    const existingInventory = await Inventory.findOne({
      product: { _id: productId },
    });
    if (!existingInventory) {
      const createdInventory = await Inventory.create({
        product: { _id: productId },
        stock: { size, quantity },
      });
      if (!createdInventory) {
        return res
          .status(200)
          .json({ success: false, message: "inventory not created" });
      }
      return res
        .status(201)
        .json({
          success: true,
          message: "inventory created",
          result: createdInventory,
        });
    }

    const existingStock = await Inventory.findOne({
      product: { _id: productId },
      stock: { $elemMatch: { size/* , quantity */ } },
    });
    if (existingStock) {
      return res
        .status(200)
        .json({ success: false, message: "this stock already exists" });
    }

    const newInventory = await Inventory.findOneAndUpdate(
      { product: { _id: productId } },
      { $push: { stock: { size, quantity } } },
      { new: true }
    );
    if (!newInventory) {
      return res
        .status(200)
        .json({
          success: false,
          message: " new stock not added to inventory ",
        });
    }
    return res
      .status(201)
      .json({
        success: true,
        message: "new stock added to inventory",
        result: newInventory,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", result: err });
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, quantity } = req.body;

    const existingStock = await Inventory.findOne({
      product: { _id: productId },
      stock: { $elemMatch: { size, quantity } },
    });
    if (existingStock) {
      return res
        .status(200)
        .json({ success: false, message: "this stock already exists" });
    }

    const existingSize = await Inventory.findOne({
      product: { _id: productId },
      stock: { $elemMatch: { size } },
    });
    if (existingSize) {
      const updatedStockWithSameSize = await Inventory.findOneAndUpdate(
        { product: { _id: productId } },
        { $set: { stock: { size, quantity } } },
        { new: true }
      );
      if (!updatedStockWithSameSize) {
        return res
          .status(200)
          .json({
            success: false,
            message: "inventory of this product not updated with same size",
          });
      }
      return res
        .status(201)
        .json({
          success: true,
          message: "inventory updated with same size",
          result: updatedStockWithSameSize,
        });
    }

    const stock = await Inventory.findOneAndUpdate(
      { product: { _id: productId } },
      { $push: { stock: { size, quantity } } },
      { new: true }
    );
    if (!stock) {
      return res
        .status(200)
        .json({
          success: false,
          message: "inventory of this product not updated",
        });
    }
    return res
      .status(201)
      .json({ success: true, message: "inventory updated", result: stock });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};

export const deleteProductQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, quantity } = req.body;
    const existingStock = await Inventory.findOne(
      { product: { _id: productId }, stock: { $elemMatch: { size } } },
      { "stock.$": 1 }
    );
    console.log(existingStock, "stock exists");
    if (existingStock) {
      const updatedStockWithSameSize = await Inventory.findOneAndUpdate(
        { product: { _id: productId }, stock: { $elemMatch: { size } } },
        { $inc: { "stock.$.quantity": -quantity } },
        { new: true }
      );
      console.log(updatedStockWithSameSize, "quantity decreased");
      if (!updatedStockWithSameSize) {
        return res
          .status(200)
          .json({
            success: false,
            message: "quantity of product not deleted with same size",
          });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "quantity decreased",
          result: updatedStockWithSameSize,
        });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", result: err });
  }
};

export const deleteProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProductStock = await Inventory.findOneAndDelete({
      product: productId,
    });
    if (!deletedProductStock) {
      return res
        .status(200)
        .json({ success: false, message: "inventory not deleted" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "inventory deleted",
        result: deletedProductStock,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};
