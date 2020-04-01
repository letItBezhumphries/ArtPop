const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});


module.exports = User = mongoose.model('user', UserSchema);