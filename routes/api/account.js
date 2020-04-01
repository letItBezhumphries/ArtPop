const express = require("express");
const router = express.Router();
const uuid = require("uuid");
require("dotenv").config();
const { check, validationResult } = require("express-validator");

//models
const User = require("../../models/User");
const Account = require("../../models/Account");
const auth = require("../../middleware/auth");





// @route = GET api/shop/my-account
// @desc gets the json obj of the users account
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);
    if (!account && user) {
      const newAcct = new Account({ user: req.user.id, cart: { items: [], total: 0, itemsCount: 0 } });
      await newAcct.save();
      return res.status(200).json(newAcct);
    }
    if (!user) {
      return res.status(400).json({ msg: 'There is no account for this user, please sign up to make a purchase' });
    }
    res.status(200).json(account);

  } catch (error) {
    console.error(Error.message);
    res.status(500).send("Server Error");
  }
});

// @route = GET api/shop/my-account/primary-card
// @desc gets the primary card for the account
// @access Private
router.get("/primary-card", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    const primaryCard = account.getPrimaryCard();
    if (!primaryCard) {
      res.status(500).send("Please provide a valid payment method for this transaction")
    }
    console.log('getPrimary card', primaryCard);
    res.status(200).json(primaryCard);

  } catch (error) {
    console.error(Error.message);
    res.status(500).send("Server Error");
  }
});

// @route = GET api/shop/my-account/address
// @desc gets the shipping address for account
// @access Private
router.get("/ship-to", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    const shipping = account.getShippingAddress();
    if (!shipping) {
      res.status(500).send("Please provide a shipping address for your order")
    }
    console.log('getShipping', shipping);
    res.status(200).json(shipping);

  } catch (error) {
    console.error(Error.message);
    res.status(500).send("Server Error");
  }
});



// @route    PUT api/shop/my-account/add-card
// @desc     Add a credit card to the account
// @access   Private
router.put("/add-card", [
    auth,
    [
      check("card_name", "card holder name is required")
        .not()
        .isEmpty(),
      check("card_number", "card number is required")
        .not()
        .isEmpty(),
      check("expiry", "expiration date is required")
        .not()
        .isEmpty(),
      check("cvv", "cvv number is required")
        .not()
        .isEmpty()
        .isInt(),
      check("billing_zip", "billing zipcode is required")
        .not()
        .isEmpty()
        .isInt(),
      check("primary", "primary is true or false")
        .isBoolean()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      card_name,
      card_number,
      expiry,
      cvv,
      billing_zip,
      primary
    } = req.body;

    const newCreditCard = {
      card_name,
      card_number,
      expiry,
      cvv,
      billing_zip,
      primary
    };

    try {
      const account = await Account.findOne({ user: req.user.id });
      
      console.log('inside update add card', newCreditCard);

      account.creditCards.push(newCreditCard);

      await account.save();

      res.status(202).json(account);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/shop/my-account/delete-card/:cardId
// @desc     Remove a credit card from account
// @access   Private
router.delete("/delete-card/:cardId", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    const cardIds = account.creditCards.map(card => card._id.toString());

    const removeIndex = cardIds.indexOf(req.params.cardId.toString());
    if (removeIndex === -1) {
      return res.status(500).json({ msg: "Server error" });
    } else {
      
      let deletedCard = account.creditCards[removeIndex];
      account.creditCards.splice(removeIndex, 1);
      await account.save();
      return res.status(203).json({ 
        msg: 'your credit card information has been permanently deleted from this account',
        removed: deletedCard
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});


//edit account
// @route    PUT api/shop/my-account/add-address
// @desc     Add an address to the account
// @access   Private
router.put(
  "/address",
  [
    auth,
    [
      check("street", "street is required")
        .not()
        .isEmpty(),
      check("city", "city is required")
        .not()
        .isEmpty(),
      check("state", "state is required")
        .not()
        .isEmpty(),
      check("zip", "zip is required as an integer")
        .not()
        .isEmpty()
        .isInt(),
      check("country", "country is required")
        .not()
        .isEmpty(),
      check("telephone", "country is required")
        .not()
        .isEmpty(),
      check("current", "shipping address is required")
        .isBoolean()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      street,
      suite,
      city,
      state,
      zip,
      country,
      telephone,
      current
    } = req.body;

    const newAddress = {
      street,
      suite,
      city,
      state,
      zip,
      country,
      telephone,
      current
    };

    try {
      const account = await Account.findOne({ user: req.user.id });
      account.addresses.push(newAddress);
      await account.save();
      res.status(203).json(account);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//delete address


// @route    DELETE api/shop/my-account/address/:addressId
// @desc     Remove a address from the account
// @access   Private
router.delete("/delete-address/:addressId", auth, async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.user.id });
    const addresses = account.addresses.map(address => address._id.toString());
    const removeIndex = addresses.indexOf(req.params.addressId.toString());
    if (removeIndex === -1) {
      return res.status(500).json({ msg: "Server error" });
    } else {
      let deletedAddress = account.addresses[removeIndex];
      account.addresses.splice(removeIndex, 1);
      await account.save();
      return res.status(204).json({ msg: 'you have successfully removed this address from the account',
        address: deletedAddress });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});





module.exports = router;
