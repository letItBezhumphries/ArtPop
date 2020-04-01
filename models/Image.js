const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  portfolio: {
    type: String,
    required: true
  },
  isGallery: {
    type: Boolean
  }, 
  price: {
    type: Number,
    required: true
  },
  height: {
    type: Number
  },
  width: {
    type: Number
  },
  inStock: {
    type: Boolean
  },
  year: {
    type: Number
  },
  medium: {
    type: String
  },
  materials: {
    type: String
  }
});

module.exports = Image = mongoose.model("image", ImageSchema);
