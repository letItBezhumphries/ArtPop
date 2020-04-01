
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { check, validationResult } = require('express-validator');


const User = require('../../models/User');
const Account = require('../../models/Account');

// @route = POST api/users
// @desc Register a user & account
// @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Please enter a password of six or more characters').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    console.log('register user', req.body);
    //check if user exists
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [{
            msg: "user already exists"
          }]
        });
      }

      //check username and password to see if they match the admin username and password
      if ((name === process.env.ADMIN_ID) && (password === process.env.ADMIN_PSWORD)) {
        user = new User({
          name: name,
          email: email,
          password: password,
          isAdmin: true
        })
      } else {
        user = new User({
          name: name,
          email: email,
          password: password,
          isAdmin: false
        })
      }


      //ecrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //save the instance
      await user.save();
      
      //build a basic cart obj
      const cart = {
        items: [],
        total: 0,
        itemsCount: 0
      }

      const account = new Account({
        user: user.id,
        cart: cart        
      });

      await account.save();

      //could add the cart to the token
      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin,
          // cart: cart
        }
      };

      jwt.sign(payload, 
        process.env.JWT_SECRET,
        { expiresIn: 36000 }, 
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        } 
      );
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
  });


module.exports = router;