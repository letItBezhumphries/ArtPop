const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      item: {
        type: Object,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  totalCost: {
    type: Number,
    required: true
  },
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    }
  },
  // coupon: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Coupon",
  //   required: false
  // },
  clientSecret: {
    type: String,
    // required: true
  },
  paymentIntent: {
    type: String
  },
  shippingAddress: {
    type: Object,
    // required: true
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  orderDate: {
    type: Date,
    default: Date.now()
  }
});




module.exports = Order = mongoose.model('order', OrderSchema);