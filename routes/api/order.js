const express = require("express");
const router = express.Router();
require("dotenv").config();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const calculateOrderTotal = require("../../client/src/utils/calculateOrderTotal");

//models
const Order = require("../../models/Order");
const Account = require("../../models/Account");
const auth = require("../../middleware/auth");

// order is created when a payment method is validated and authorized token is received from stripe?
// should this be sending back an email to user
// @route = POST api/shop/order
// @desc creates a new order
// @access Private
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select(
      "name email"
    );
    const account = await Account.findOne({
      user: req.user.id
    })
      .populate({ path: "cart.items.itemId", model: "image" })
      .select("-wishList");

    const items = account.cart.items.map(i => {
      return { quantity: i.quantity, item: { ...i.itemId._doc } };
    });

    let cart = account.getCart();

    // const getItemPrice = price => {
    //   let tax = price * 0.12;
    //   let total = price + tax;
    //   return total * 100;
    // };

    // const orderItems = items.map(i => {
    //   return {
    //     amount: getItemPrice(i.item.price),
    //     description: `${i.item.title}, ${i.item.year}, ${i.item.description}.`,
    //     quantity: i.quantity
    //   };
    // });

    const order = new Order({
      user: {
        name: user.name,
        userId: req.user.id
      },
      items: items,
      totalCost: cart.total,
      isPaid: false
    });
    order.save();

    account.clearCart();

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



// @route = POST api/shop/order/:id
// @desc creates a new paymentIntent object -saving the clientSecret for this order to the order instance 
//and sending the clientSecret back to the client
// @access Private
router.post("/:id", auth, async (req, res) => {
  try {
    console.log('in api/shop/order:id, payment-intent req.body:', req.body);
    
    let { currency,
      payment_method_id } = req.body;

    const user = await User.findOne({ _id: req.user.id }).select(
      "name email"
    );

    let intent;

    const order = await Order.findById(req.params.id);

    if (payment_method_id) {
      intent = await stripe.paymentIntents.create({
        payment_method: payment_method_id,
        amount: order.totalCost,
        currency: currency,
        metadata: {
          order_id: order._id
        },
        confirmation_method: 'manual',
        confirm: true
      });
    } else {
      intent = await stripe.paymentIntents.create({
        amount: order.totalCost,
        currency: currency,
        payment_method_types: ["card"],
        setup_future_usage: "on_session",
        receipt_email: user.email,
        // receipt_url: process.env.API_URL + "/payment-success"
      });
    }

    console.log('in api/shop/order:id, init-payment-intent => clientSectret:', intent);
    order.paymentIntent = intent.id
    order.clientSecret = intent.client_secret;
    await order.save();

    res.status(201).json({ payment_intent_id: intent.id, client_secret: intent.client_secret });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



//@route GET api/shop/order/:id
//@desc get an order object containing details for a specified order by id
//@access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    console.log("in get order", order);

    // if (order.user.userId !== req.user.id) {
    //   res.status(401).json({ message: "your are not currently authorized to access this account, please sign in"});
    // }
    //check to make sure that the accountId or userId is equal to the currently signed in user
    res.status(200).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/shop/order/all
//@desc get json list of order history from account
//@access Private

router.get("/all", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user.id });

    console.log("orders get", orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/shop/order/:id
//@desc updates a order, like after payment confirmation has been made 
//@access Private
router.put("/id", auth, async (req, res) => {
  try {
    
  } catch (err) {
    
  }
});


//@route DELETE api/shop/order/:id
//@desc deletes a order that has been started
//@access Private
router.delete("/id", auth, async (req, res) => {
  try {
    
  } catch (err) {
    
  }
});

module.exports = router;
