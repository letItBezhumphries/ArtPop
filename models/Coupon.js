const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  }
});

module.exports = Coupon = mongoose.model('Coupon', CouponSchema);