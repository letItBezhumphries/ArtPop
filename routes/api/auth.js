const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { check, validationResult } = require('express-validator');


const User = require('../../models/User');
const auth = require('../../middleware/auth');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



// @route = GET api/auth
// @desc Register user
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});



// @route = POST api/auth
// @desc Authenticate user & get a token 
// @access Public
router.post('/',
  [
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //check if user exists
    const { email, password } = req.body;

    try {
      let user = await User.findOne({
        email
      });

      console.log('inside auth:', user);
      
      if (!user) {
        return res.status(400).json({
          errors: [{
            msg: "Invalid Credentials"
          }]
        });
      }

      //check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ 
          errors: [{ 
            msg: "Invalid Credentials" 
          }] 
        });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload,
        process.env.JWT_SECRET, {
          expiresIn: 36000
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


module.exports = router;