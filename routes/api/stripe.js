const express = require("express");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const calculateOrderTotal = require('../../client/src/utils/calculateOrderTotal');
const generateResponse = require('../../client/src/utils/generateResponse');

//models
const Order = require('../../models/Order');
const Account = require("../../models/Account");
const User = require("../../models/User");
const auth = require("../../middleware/auth");


//@route POST api/stripe/payment-method
//@desc
//@access Private
router.post('/payment-method', auth, async (req, res) => {
  try {
    const { payment_method_id, shipping, payment_intent_id } = req.body;

    console.log('api/stripe/payment-method handler => req.body:=> payment_intent_id:', payment_intent_id, "payment_method_id:", payment_method_id, "shipping:", shipping);

    const user = await User.findById(req.user.id);

    const account = await Account.findOne({ user: req.user.id });

    //create a Customer to store the PaymentMethod
    const customer = await stripe.customers.create({
      email: user.email,
      payment_method: payment_method_id,
      invoice_settings: {
        default_payment_method: "pm_1FWS6ZClCIKljWvsVCvkdyWg"
      }
    });

    console.log("if isSavingCard been clicked", customer);

    account.paymentMethod = payment_method_id;
    account.customerId = customer.id
    
    await account.save();

    console.log("if isSavingCard been clicked", account);

    res.status(200).json(account);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})





// @route = POST /api/stripe/payment-intent
// @desc creates a payment intent on the stripe database
// @access Private
router.post('/payment', auth, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    const account = await Account.findOne({
      user: req.user.id
    })
      .populate({ path: "cart.items.itemId", model: "image" })
      .select("-wishList");

    let order = await account.getCart();
    
    const { payment_intent_id, payment_method_id, currency, isSavingCard, shipping } = req.body;

    console.log('api/stripe/payment, payment_intent_id:', payment_intent_id, "payment_method_id:", payment_method_id, "currency:", currency, "isSavingCard:", isSavingCard, "shipping:", shipping);

    const { street, unit, city, state, country, zip } = shipping;

    const orderTotal = calculateOrderTotal(order.items);

    let intent;
    
    //check the req.body for the paymentMethod_id
    //if no payment_intent has been started
    if (!payment_intent_id) {
      //create new PaymentIntent
      let paymentIntentData = {
        amount: orderTotal,
        currency: 'usd',
        payment_method: payment_method_id,
        confirmation_method: "manual",
        confirm: true,
        save_payment_method: isSavingCard,
        receipt_email: user.email,
        error_on_requires_action: true,
        // customer: customer.id,
        // setup_future_usage: "on_session"
      };

      intent = await stripe.paymentIntents.create(paymentIntentData);

    } else {
      intent = await stripe.paymentIntents.confirm(payment_intent_id, {
        payment_method: payment_method_id
      });
    }
    console.log('in api/post/payment-intent, paymentIntentObject:', intent);
    
    let successfulResponse = generateResponse(intent);
    console.log("in api/post/payment, response:", successfulResponse);

    res.status(200).json(successfulResponse);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// // Update PaymentIntent with shipping cost.
// router.post("/payment_intents/:id/shipping_change", async (req, res) => {
//   const { items, shippingOption } = req.body;
//   let amount = await calculatePaymentAmount(items);
//   amount += products.getShippingCost(shippingOption.id);

//   try {
//     const paymentIntent = await stripe.paymentIntents.update(req.params.id, {
//       amount
//     });
//     return res.status(200).json({ paymentIntent });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

// @route = POST /api/stripe/webhook
// @desc webhook handler for dealing with async events
// @access Private
router.post("/webhook", auth, async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    /*
    //To ensure that only payment methods which can be charged are saved to a customer, 
    //you can manually save the payment method in response to the payment_intent.succeeded webhook.
     */
    // Fulfill any orders, e-mail receipts, notify shipping etc
    console.log("💰 Payment received!");
    const paymentIntent = event.data.object;
    console.log("in api/stripe/webhooks => paymentIntent:", paymentIntent);
    //need to update the order instance in our database to have isPaid set to true
    //save the order instance
  }

  if (eventType === "payment_intent.requires_payment_method") {
    console.log('need to provide an authenticated payment method!!!');
  }

  if (eventType === "payment_intent.payment_failed") {
    // Notify the customer that their order was not fulfilled
    console.log("❌ Payment failed.");
  }

  res.sendStatus(200);
});


// Webhook handler to process payments for sources asynchronously.
// router.post("/webhook", async (req, res) => {
//   let data;
//   let eventType;
//   // Check if webhook signing is configured.
//   if (config.stripe.webhookSecret) {
//     // Retrieve the event by verifying the signature using the raw body and secret.
//     let event;
//     let signature = req.headers["stripe-signature"];
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.rawBody,
//         signature,
//         config.stripe.webhookSecret
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`);
//       return res.sendStatus(400);
//     }
//     // Extract the object from the event.
//     data = event.data;
//     eventType = event.type;
//   } else {
//     // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//     // retrieve the event data directly from the request body.
//     data = req.body.data;
//     eventType = req.body.type;
//   }
//   const object = data.object;

//   // Monitor payment_intent.succeeded & payment_intent.payment_failed events.
//   if (object.object === "payment_intent") {
//     const paymentIntent = object;
//     if (eventType === "payment_intent.succeeded") {
//       console.log(
//         `🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} succeeded.`
//       );
//     } else if (eventType === "payment_intent.payment_failed") {
//       const paymentSourceOrMethod = paymentIntent.last_payment_error
//         .payment_method
//         ? paymentIntent.last_payment_error.payment_method
//         : paymentIntent.last_payment_error.source;
//       console.log(
//         `🔔  Webhook received! Payment on ${paymentSourceOrMethod.object} ${paymentSourceOrMethod.id} of type ${paymentSourceOrMethod.type} for PaymentIntent ${paymentIntent.id} failed.`
//       );
//       // Note: you can use the existing PaymentIntent to prompt your customer to try again by attaching a newly created source:
//       // https://stripe.com/docs/payments/payment-intents/usage#lifecycle
//     }
//   }

//   // Monitor `source.chargeable` events.
//   if (
//     object.object === "source" &&
//     object.status === "chargeable" &&
//     object.metadata.paymentIntent
//   ) {
//     const source = object;
//     console.log(`🔔  Webhook received! The source ${source.id} is chargeable.`);
//     // Find the corresponding PaymentIntent this source is for by looking in its metadata.
//     const paymentIntent = await stripe.paymentIntents.retrieve(
//       source.metadata.paymentIntent
//     );
//     // Check whether this PaymentIntent requires a source.
//     if (paymentIntent.status != "requires_payment_method") {
//       return res.sendStatus(403);
//     }
//     // Confirm the PaymentIntent with the chargeable source.
//     await stripe.paymentIntents.confirm(paymentIntent.id, {
//       source: source.id
//     });
//   }

//   // Monitor `source.failed` and `source.canceled` events.
//   if (
//     object.object === "source" &&
//     ["failed", "canceled"].includes(object.status) &&
//     object.metadata.paymentIntent
//   ) {
//     const source = object;
//     console.log(`🔔  The source ${source.id} failed or timed out.`);
//     // Cancel the PaymentIntent.
//     await stripe.paymentIntents.cancel(source.metadata.paymentIntent);
//   }

//   // Return a 200 success code to Stripe.
//   res.sendStatus(200);
// });

// /**
//  * Routes exposing the config as well as the ability to retrieve products.
//  */

// // Expose the Stripe publishable key and other pieces of config via an endpoint.
// router.get("/config", (req, res) => {
//   res.json({
//     stripePublishableKey: config.stripe.publishableKey,
//     stripeCountry: config.stripe.country,
//     country: config.country,
//     currency: config.currency,
//     paymentMethods: config.paymentMethods,
//     shippingOptions: config.shippingOptions
//   });
// });

// // Retrieve all products.
// router.get("/products", async (req, res) => {
//   res.json(await products.list());
// });

// // Retrieve a product by ID.
// router.get("/products/:id", async (req, res) => {
//   res.json(await products.retrieve(req.params.id));
// });

// // Retrieve the PaymentIntent status.
// router.get("/payment_intents/:id/status", async (req, res) => {
//   const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
//   res.json({ paymentIntent: { status: paymentIntent.status } });
// });



module.exports = router;