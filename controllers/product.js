import Product from "../models/product.js";

export const getProductList = async (req, res) => {
  try {
    const productList = await Product.find();
    if (!productList) {
      return res
        .status(200)
        .json({ success: false, message: "product list not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "retrieved product list",
        result: productList,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const prodByCat = await Product.find({ category: category });
    if (!prodByCat) {
      return res
        .status(200)
        .json({
          success: false,
          message: "product by this category not found",
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "retrieved product by category",
        result: prodByCat,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};

export const getProductsBySubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.params;
    const prodBySubCat = await Product.find({
      category: category,
      subCategory: subCategory,
    });
    if (!prodBySubCat) {
      return res
        .status(200)
        .json({
          success: false,
          message: "product by this sub category not found",
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "retrieved product by sub category",
        result: prodBySubCat,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};

export const getParticularProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(200)
        .json({ success: false, message: "product by this id not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "retrieved product by id",
        result: product,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", result: err });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { title, category, subCategory, description, quantity, size, price } =
      req.body;
    const image = req.file.path;
    const product = await Product.create({
      title,
      image,
      category,
      subCategory,
      description,
      quantity,
      size,
      price,
    });
    if (!product) {
      return res
        .status(200)
        .json({ success: false, message: "product not created" });
    }
    return res
      .status(201)
      .json({ success: true, message: "product created", result: product });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", result: err });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productData = req.body;
    const image = req.file.path;
    const { productId } = req.params;
    var productEdit;
    if (image) {
      productEdit = { productData, image };
    } else {
      productEdit = { productData };
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: productEdit },
      { new: true }
    );
    if (!product) {
      return res
        .status(200)
        .json({ success: false, message: "product not updated" });
    }
    return res
      .status(201)
      .json({ success: true, message: "product updated", result: product });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ _id: productId });
    if (!deletedProduct) {
      return res
        .status(200)
        .json({ success: false, message: "product not deleted" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "product deleted",
        result: deletedProduct,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: true, message: "something went wrong", result: err });
  }
};
