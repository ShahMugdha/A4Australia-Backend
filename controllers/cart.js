import Product from "../models/product.js";
import Cart from "../models/cart.js";
import WishList from "../models/wishlist.js";
import Inventory from "../models/inventory.js";

export const getCartList = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.userData }).populate("user").populate("cart.product");
    if (!cart) {
      return res.status(200).json({ success: false, message: "cart list not found" });
    }
    return res.status(200).json({ success: true, message: "retrieved cart list", result: cart });
  } catch (err) {
    return res.status(200).json({ success: false, message: "something went wrong", result: err });
  }
};

export const getParticularProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(200).json({ success: false, message: `product by the title: ${product.title} not found` });
    }
    return res.status(200).json({success: true, message: `retrieved product by title: ${product.title}`, result: product});
  } catch (err) {
    return res.status(200).json({ success: false, message: "something went wrong", result: err });
  }
};

export const addProductToCart = async (req, res) => {
  const { productId, size } = req.params;
  try {
    const user = req.userData;
    const product = await Product.findById(productId);
    const sizeCheck = await Inventory.findOne({product: {_id: productId}, stock: {$elemMatch: {size, quantity: {$gt:0}}}}).populate('product')
    if(!sizeCheck) {
      return res.status(200).json({success: false, message: "product of this size out of stock"});
    }
    const userExists = await Cart.findOne({ user });
    if (!userExists) {
      const cart = await Cart.create({
        user,
        cart: { product:{_id: productId}, size, quantity, price: product.price },
      });
      console.log(cart, "cart")
      if (!cart) {
        return res.status(200).json({ success: false, message: "cart not created" });
      }
      const updatedCart = await Cart.findOneAndUpdate(
        {user: req.userData},
        {$inc: {totalQuantity: 1, totalPrice: product.price}},
        {new: true}
      ).populate('product')
      console.log(updatedCart, "cart updated with total quantity after creation")
      if(!updatedCart) {
        return res.status(200).json({success: false, message: "cart not updated after creation"});
      }
      return res.status(201).json({success: true, message: "cart created with one product", result: cart});
    }
    const productExists = await Cart.findOne({
      user,
      cart: { $elemMatch: { product, size } },
    });
    if (!productExists) {
      const newProduct = await Cart.findOneAndUpdate(
        { user },
        {$push: { cart: { product, size, price: product.price } }},
        { new: true }
      );
      console.log(newProduct, "add to cart");
      if (!newProduct) {
        return res.status(200).json({ success: false, message: "new product not added to cart" });
      }
      const updatedCart = await Cart.findOneAndUpdate(
        {user: req.userData},
        {$inc: {totalQuantity: 1, totalPrice: product.price}},
        {new: true}
      ).populate('product')
      console.log(updatedCart, "cart updated with total quantity")
      if(!updatedCart) {
        return res.status(200).json({success: false, message: "cart not updated"});
      }
      return res.status(201).json({success: true, message: "new product added to cart", result: newProduct});
    }
    return res.status(200).json({success: false, message: "This product already exists in the cart"});
  } catch (err) {
    return res.status(200).json({ success: false, message: "something went wrong", result: err });
  }
};

export const updateProductSize = async (req, res) => {
  try {
    const { productId, originalSize, updatedSize } = req.params;
    console.log(req.params, "params");
    const existingSize = await Cart.findOne({
      user: req.userData,
      cart: {$elemMatch: { product: { _id: productId }, size: updatedSize }},
    },{ "cart.$": 1 });
    console.log(existingSize, "existing size");
    if (existingSize) {
      const updatedProductQuantity = await Cart.findOneAndUpdate(
        {
          user: req.userData,
          cart: {$elemMatch: { product: { _id: productId }, size: updatedSize }},
        },
        {$inc: {"cart.$.price": existingSize.cart[0].price, "cart.$.quantity": existingSize.cart[0].quantity}},
        { new: true }
      );
      console.log(updatedProductQuantity, "quantity and price updated");
      if (updatedProductQuantity) {
        const deletedProductwithSameSize = await Cart.findOneAndUpdate(
          {
            user: req.userData,
            cart: {$elemMatch: { product: { _id: productId }, size: updatedSize }},
          },
          {
            $pull: {cart: { product: { _id: productId }, size: originalSize }},
          },
          { new: true }
        );
        console.log(deletedProductwithSameSize, "deleted");
        if (deletedProductwithSameSize) {
          const quantityCheck = await Cart.findOne({user: req.userData, cart: {$size: 0}})
          if(quantityCheck && quantityCheck.cart.length === 0) {
            const deleteCartByUser = await Cart.findOneAndDelete({user: req.userData})
            if(deleteCartByUser) console.log("cart dropped") 
          }
        }
      }
      return res.status(400).json({success: false, message: "product quantity not updated", result: deletedProductwithSameSize});
    }

    const updatedProductSize = await Cart.findOneAndUpdate(
      {
        user: req.userData,
        cart: {$elemMatch: { product: { _id: productId }, size: originalSize }},
      },
      { $set: { "cart.$.size": updatedSize } },
      { new: true }
    );
    if (!updatedProductSize) {
      return res.status(200).json({ success: false, message: "product size not updated" });
    }
    return res.status(201).json({success: true, message: "product size updated", result: updatedProductSize});
  } catch (err) {
    return res.status(200).json({ success: false, message: "something went wrong", result: err });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { productId, size, quantity } = req.params;
    const product = await Product.findById(productId);
    const cartProduct = await Cart.findOne(
      {
        user: req.userData,
        cart: { $elemMatch: { product: { _id: productId }, size } },
      },
      { "cart.$": 1 }
    );
    const previousQuantity = cartProduct.cart[0].quantity;
    const diff = quantity - previousQuantity;
    const updatedProductQuantity = await Cart.findOneAndUpdate(
      {
        user: { _id: req.userData._id },
        cart: { $elemMatch: { product: { _id: productId }, size } },
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
      return res.status(200).json({ success: false, message: "product quantity not updated" });
    }
    return res.status(201).json({success: true, message: "product quantity updated", result: updatedProductQuantity});
  } catch (err) {
    return res.status(200).json({ success: false, message: "something went wrong", result: err });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { productId, size } = req.params;
    const product = await Product.findById(productId);
    const cartProduct = await Cart.findOne(
      {
        user: req.userData,
        cart: { $elemMatch: { product: { _id: productId }, size } },
      },
      { "cart.$": 1 }
    );
    const quantity = cartProduct.cart[0].quantity;
    const price = product.price;

    const deletedProduct = await Cart.findOneAndUpdate(
      {
        user: req.userData,
        cart: { $elemMatch: { product: { _id: productId }, size } },
      },
      { $pull: { cart: { product: { _id: productId }, size } } },
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
      return res.status(400).json({ success: false, message: "total quantity and price not updated"});
    }
    const quantityCheck = await Cart.findOne({user: req.userData, cart: {$size: 0}})
    if(quantityCheck && quantityCheck.cart.length === 0) {
      const deleteCartByUser = await Cart.findOneAndDelete({user: req.userData})
      if(deleteCartByUser) console.log("cart dropped") 
    }
    return res.status(200).json({success: true, message: "product deleted from cart successfully", result: updatedQuantityAndPrice});
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong", result: err });
  }
};

export const moveProductToWishList = async (req, res) => {
  try {
    const { productId, size } = req.params;
    const product = await Product.findById(productId);
    const existingWishList = await WishList.findOne({user: req.userData})
    const existingProduct = await WishList.findOne({user: req.userData, products: productId})
    console.log(existingProduct, "product with same size")
    if(existingProduct) {
      return res.status(200).json({success: false, message: `${product.title} already exists in your wishlist`});
    }
    const cartProduct = await Cart.findOne(
      {
        user: req.userData,
        cart: { $elemMatch: { product: { _id: productId }, size } },
      },
      { "cart.$": 1 }
    );
    const quantity = cartProduct.cart[0].quantity;
    const price = product.price;
    const removedProduct = await Cart.findOneAndUpdate(
      {
        user: { _id: req.userData._id },
        cart: { $elemMatch: { product: { _id: productId }, size } },
      },
      { $pull: { cart: { product: { _id: productId }, size } } },
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
      return res.status(400).json({success: false, message: "total quantity and price not updated"});
    }
    if(!existingWishList) {
      const addedProduct = await WishList.create({
        user: req.userData,
        products: product
      })
      if(!addedProduct) {
        return res.status(200).json({success: false, message: "wishlist not created"});
      }
      return res.status(201).json({success: true, message: "wishlist created with one product", result: addedProduct});
    }
    const movedProduct = await WishList.findOneAndUpdate(
      { user: req.userData },
      { $push: { products: productId } }
    );
    if (!movedProduct) {
      return res.status(200).json({ success: false, message: "product not moved to wishlist" });
    }
    const quantityCheck = await Cart.findOne({user: req.userData, cart: {$size: 0}})
    if(quantityCheck && quantityCheck.cart.length === 0) {
      const deleteCartByUser = await Cart.findOneAndDelete({user: req.userData})
      if(deleteCartByUser) console.log("cart dropped") 
    }
    return res.status(200).json({success: true, message: "product moved to wishlist", result: movedProduct});
  } catch (err) {
    return res.status(200).json({ success: false, message: "something went wrong", result: err });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const deletedCart = await Cart.findOneAndDelete({ user: req.userData }).populate("user").populate("cart.product");
    if (!deletedCart) {
      return res.status(200).json({ success: false, message: "cart not deleted" });
    }
    return res.status(200).json({ success: true, message: "cart deleted successfully", result: deletedCart });
  } catch (err) {
    return res.status(200).json({ success: false, message: "something went wrong", result: err });
  }
};
