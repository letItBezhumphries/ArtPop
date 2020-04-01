const express = require("express");
const router = express.Router();
require("dotenv").config();

//models
const User = require("../../models/User");
const Account = require("../../models/Account");
const auth = require("../../middleware/auth");

// @route    GET api/shop/my-cart
// @desc     Get current users cart
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id }).populate("cart.items.itemId");
    const user = await User.findById(req.user.id);
    if (!account && user) {
      const newAcct = new Account({
        user: req.user.id,
        cart: { items: [], total: 0, itemsCount: 0 }
      });
      await newAcct.save();
      console.log('You have created an account:', newAcct);
      return res.status(200).json(newAcct.getCart());
    }
    if (!user) {
      return res
        .status(400)
        .json({
          msg:
            "You are not logged in, please sign in to make a purchase"
        });
    }
    const cart = await account.getCart();
    console.log("in routes/api/shop/my-cart GET_CART:", cart);
    res.status(200).json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route = POST api/shop/my-cart/:id
// @desc add artwork to the items array in cart
// @access Private
router.post("/:id", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Image.findById({ _id: req.params.id }).select(
      "-fileName -isGallery"
    );

    if (!item.inStock) {
      res.status(400).json({ msg: "Sorry, this item is no longer in stock" });
    }
    
    const account = await Account.findOne({
      user: req.user.id
    }).populate({ path: "cart.items.itemId", model: 'image' });

    const updatedAccount = await account.addToCart(item, quantity);
    // console.log("4 inside cart post, newCart:", updatedAccount);
    const items = updatedAccount.cart.items.map(i => {
      return { quantity: i.quantity, itemId: { ...i.itemId._doc } };
    });

    let cart = { ...updatedAccount.cart, items: items };
    
    console.log("5 inside cart post, cart:", cart);
    res.status(201).json({ item, cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route = DELETE api/shop/my-cart/:id
// @desc delete an artwork/item from cart by id
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Image.findById({ _id: req.params.id }).select(
      "-fileName -isGallery"
    );;
    
    const account = await Account.findOne({
      user: req.user.id
    }).populate('cart.items.itemId');

    await account.removeFromCart(item, quantity, item.price);
    
    let cart = await account.getCart();
    console.log("5 inside cart post, new cart:", cart);

    res.status(203).json({ item, cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route = DELETE api/shop/my-cart
// @desc deletes all items from the cart / clear the cart
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      user: req.user.id
    });
    
    //clearCart() convenience method should save the model instance before return
    let clearedCartAccount = await account.clearCart();
    console.log('in api/shop/my-cart clearCart', clearedCartAccount);

    let newCart = await account.getCart();
    console.log("inside routes/api/cart.js clearCart result", newCart);  

    res.status(203).json(newCart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});





module.exports = router;


