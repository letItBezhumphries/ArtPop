const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = Coupon = mongoose.model("Coupon", CouponSchema);
