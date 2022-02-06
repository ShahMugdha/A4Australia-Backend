import Product from "../models/product.js";
import Cart from "../models/cart.js";
import WishList from "../models/wishlist.js";
import Inventory from "../models/inventory.js";

export const getCartList = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.userData }).populate("user").populate("cart.productCart");
    if (!cart) {
      return res.status(200).json({ success: false, message: "cart list not found" });
    }
    return res.status(200).json({ success: true, message: "retrieved cart list", result: cart });
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};

export const getParticularProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(200).json({ success: false, message: "product by this title not found" });
    }
    return res.status(200).json({success: true, message: "retrieved product by title", result: product});
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};

export const addProductToCart = async (req, res) => {
  const { productId, size } = req.params;
  try {
    const user = req.userData;
    const product = await Product.findById(productId);
    const userExists = await Cart.findOne({ user });
    if (!userExists) {
      const cart = await Cart.create({
        user,
        cart: { productCart:{_id: productId}, size, quantity, price: product.price },
        totalPrice: product.price,
        totalQuantity: 1,
      });
      if (!cart) {
        return res.status(200).json({ success: false, message: "new cart not created" });
      }
      return res.status(201).json({success: true, message: "new cart created with one product", result: cart});
    }
    const productExists = await Cart.findOne({
      user,
      cart: { $elemMatch: { productCart: { _id: productId }, size } },
    });
    if (!productExists) {
      const newProduct = await Cart.findOneAndUpdate(
        { user },
        { 
          $addToSet: { cart: { productCart:{_id: productId}, size, price: product.price } },
          $inc: { totalQuantity: 1, totalPrice: product.price },
        },
        { new: true }
      );
      console.log(newProduct, "add to cart");
      if (!newProduct) {
        return res.status(200).json({ success: false, message: "new product not added to cart" });
      }
      return res.status(201).json({success: true, message: "new product added to cart", result: newProduct});
    }
    return res.status(200).json({success: false, message: "This product already exists in the cart"});
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};

export const updateProductSize = async (req, res) => {
  try {
    const { productId, originalSize, updatedSize } = req.params;
    console.log(req.params, "params");
    const existingSize = await Cart.findOne({
      user: req.userData,
      cart: {$elemMatch: { productCart: { _id: productId }, size: updatedSize }},
    },{ "cart.$": 1 });
    console.log(existingSize, "existing size");
    if (existingSize) {
      const updatedProductQuantity = await Cart.findOneAndUpdate(
        {
          user: req.userData,
          cart: {$elemMatch: { productCart: { _id: productId }, size: updatedSize }},
        },
        {$inc: {"cart.$.price": existingSize.cart[0].price, "cart.$.quantity": existingSize.cart[0].quantity}},
        { new: true }
      );
      console.log(updatedProductQuantity, "quantity and price updated");
      if (updatedProductQuantity) {
        const deletedProductwithSameSize = await Cart.findOneAndUpdate(
          {
            user: req.userData,
            cart: {$elemMatch: { productCart: { _id: productId }, size: updatedSize }},
          },
          {
            $pull: {cart: { productCart: { _id: productId }, size: originalSize }},
          },
          { new: true }
        );
        console.log(deletedProductwithSameSize, "deleted");
        if (!deletedProductwithSameSize) {
          return res.status(200).json({ success: false, message: "product not deleted" });
        }
        return res.status(201).json({success: true, message: "product deleted", result: deletedProductwithSameSize});
      }
      return res.status(200).json({success: false, message: "product quantity not updated", result: deletedProductwithSameSize});
    }

    const updatedProductSize = await Cart.findOneAndUpdate(
      {
        user: req.userData,
        cart: {$elemMatch: { productCart: { _id: productId }, size: originalSize }},
      },
      { $set: { "cart.$.size": updatedSize } },
      { new: true }
    );
    if (!updatedProductSize) {
      return res.status(200).json({ success: false, message: "product size not updated" });
    }
    return res.status(201).json({success: true, message: "product details updated with size", result: updatedProductSize});
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { productId, size, quantity } = req.params;
    const product = await Product.findById(productId);
    const cartProduct = await Cart.findOne(
      {
        user: req.userData,
        cart: { $elemMatch: { productCart: { _id: productId }, size } },
      },
      { "cart.$": 1 }
    );
    const previousQuantity = cartProduct.cart[0].quantity;
    const diff = quantity - previousQuantity;
    const updatedProductQuantity = await Cart.findOneAndUpdate(
      {
        user: { _id: req.userData._id },
        cart: { $elemMatch: { productCart: { _id: productId }, size } },
      },
      {
        $set: {
          "cart.$.quantity": quantity,
          "cart.$.price": product.price * quantity,
        },
        $inc: { totalQuantity: diff, totalPrice: diff * product.price },
      },
      { new: true }
    );
    if (!updatedProductQuantity) {
      return res.status(200).json({ success: false, message: "product details not updated" });
    }
    return res.status(201).json({success: true, message: "product details updated with size", result: updatedProductQuantity});
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong", result: err });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { productId, size } = req.params;
    const product = await Product.findById(productId);
    const cartProduct = await Cart.findOne(
      {
        user: req.userData,
        cart: { $elemMatch: { productCart: { _id: productId }, size } },
      },
      { "cart.$": 1 }
    );
    const quantity = cartProduct.cart[0].quantity;
    const price = product.price;

    const deletedProduct = await Cart.findOneAndUpdate(
      {
        user: req.userData,
        cart: { $elemMatch: { productCart: { _id: productId }, size } },
      },
      { $pull: { cart: { productCart: { _id: productId }, size } } },
      { new: true }
    );
    if (!deletedProduct) {
      return res.status(200).json({ success: false, message: "product not deleted from cart" });
    }
    console.log(deletedProduct, "deleted from cart");

    const updatedQuantityAndPrice = await Cart.findOneAndUpdate(
      { user: req.userData },
      { $inc: { totalQuantity: -quantity, totalPrice: -price } },
      { new: true }
    );
    console.log(updatedQuantityAndPrice, "deleted from cart & cart updated");
    if (!updatedQuantityAndPrice) {
      return res.status(200).json({ success: false, message: "total quantity and price not updated"});
    }
    return res.status(200).json({success: true, message: "product deleted from cart and quantity price updated", result: updatedQuantityAndPrice});
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};

export const moveProductToWishList = async (req, res) => {
  try {
    const { productId, size } = req.params;
    const product = await Product.findById(productId);
    const cartProduct = await Cart.findOne(
      {
        user: req.userData,
        cart: { $elemMatch: { productCart: { _id: productId }, size } },
      },
      { "cart.$": 1 }
    );
    const quantity = cartProduct.cart[0].quantity;
    const price = product.price;
    const removedProduct = await Cart.findOneAndUpdate(
      {
        user: { _id: req.userData._id },
        cart: { $elemMatch: { productCart: { _id: productId }, size } },
      },
      { $pull: { cart: { productCart: { _id: productId }, size } } },
      { new: true }
    );
    if (!removedProduct) {
      return res.status(200).json({ success: false, message: "product not found in cart" });
    }
    const updatedQuantityAndPrice = await Cart.findOneAndUpdate(
      { user: req.userData },
      { $inc: { totalQuantity: -quantity, totalPrice: -price } },
      { new: true }
    );
    console.log(updatedQuantityAndPrice, "deleted from cart & cart updated");
    if (!updatedQuantityAndPrice) {
      return res.status(200).json({success: false, message: "total quantity and price not updated"});
    }
    const movedProduct = await WishList.findOneAndUpdate(
      { user: { _id: req.userData._id } },
      { $push: { products: productId } }
    );
    if (!movedProduct) {
      return res.status(200).json({ success: false, message: "product not moved to wishlist" });
    }
    return res.status(200).json({success: true, message: "product moved to wishlist", result: movedProduct});
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const deletedCart = await Cart.findOneAndDelete({ user: req.userData })
      .populate("user")
      .populate("cart.product");
    if (!deletedCart) {
      return res.status(200).json({ success: false, message: "cart not deleted" });
    }
    return res.status(200).json({ success: true, message: "cart deleted", result: deletedCart });
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};
