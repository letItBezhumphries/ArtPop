const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  paymentMethod: {
    type: String
  },
  customerId: {
    type: String
  },
  addresses: [
    {
      street1: {
        type: String,
        required: false
      },
      street2: {
        type: Number,
        required: false
      },
      city: {
        type: String,
        required: false
      },
      state: {
        type: String,
        required: false
      },
      zip: {
        type: Number,
        required: false
      },
      country: {
        type: String,
        required: false
      },
      telephone: {
        type: String,
        required: false
      },
      current: {
        type: Boolean,
        required: false
      }
    }
  ],
  creditCards: [
    {
      card_name: {
        type: String,
        required: true
      },
      card_number: {
        type: String,
        required: true
      },
      expiry: {
        type: String,
        required: true
      },
      cvv: {
        type: Number,
        required: true
      },
      billing_zip: {
        type: Number,
        required: true
      },
      primary: {
        type: Boolean,
        required: true
      }
    }
  ],
  cart: {
    items: [
      {
        _id: false,
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "image",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    itemsCount: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  wishlist: [
    {
      artwork: {
        type: Schema.Types.ObjectId,
        ref: "image"
      }
    }
  ]
});

AccountSchema.methods.addToCart = function(artwork, quantity) {
  let newQuantity = 1;
  const cartItemIndex = this.cart.items.findIndex(item => {
    // console.log('item.itemId equals', item.itemId.equals(artwork._id));
    // return item.itemId.toString() === artwork._id.toString(); using toString() 
    //to check the equality of objectIds in mongoose was not reliable and completely wasted time
    //the last item or thus the last objectId was always listed as a string as if mongoose hadn't yet 
    //transformed the string value from it populated object form/  using equals() fixed this problem
    return item.itemId.equals(artwork._id);
    // return item._id.equals(artwork._id);
  });
  
  const oldTotalAmnt = this.cart.total;
  let newTotalAmnt = oldTotalAmnt + (artwork.price * quantity);
  
  const updatedCartItems = [...this.cart.items];
  let newItemsCount = this.cart.itemsCount + quantity;
  //check if the item already exists in the cart
  if (cartItemIndex >= 0) {
    newQuantity = this.cart.items[cartItemIndex].quantity + 1;
    // newQuantity = this.cart.items[cartItemIndex].quantity + quantity;
    updatedCartItems[cartItemIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      itemId: artwork._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems,
    total: newTotalAmnt,
    itemsCount: newItemsCount
  };

  this.cart = updatedCart;
  // console.log("inside addToCart method", this.cart);
  return this.save();
}

AccountSchema.methods.getCart = function() {
  const cart = this.cart;
  return cart;
}

AccountSchema.methods.removeFromCart = function(artwork, quantity, price) {
  //check if the item already exists in the cart
  const cartItemIndex = this.cart.items.findIndex(item => {
    return item.itemId.equals(artwork._id);   
  }); 

  const oldTotal = this.cart.total;
  const updatedTotal = oldTotal - price;

  const updatedCount = this.cart.itemsCount - 1;
  
  const updatedCartItems = [...this.cart.items];

  //it the item has a quantity greater than 1 need to adjust that items quantity otherwise splice away the item
  if (updatedCartItems[cartItemIndex].quantity > 1) {
    let newQuantity = updatedCartItems[cartItemIndex].quantity - 1;
    updatedCartItems[cartItemIndex].quantity = newQuantity;
  } else {
    updatedCartItems.splice(cartItemIndex, 1);
  }

  const updatedCart = {
    items: updatedCartItems,
    total: updatedTotal,
    itemsCount: updatedCount
  };
  this.cart = updatedCart;
  console.log("removeFromCart, before return:", this.cart);
  return this.save();
}

AccountSchema.methods.getShippingAddress = function() {
  const shipTo = this.addresses.filter(address => address.current);
  return shipTo[0];
}


AccountSchema.methods.clearCart = function() {
  const updatedCart = {
    items: [],
    total: 0,
    itemsCount: 0
  };
  this.cart = updatedCart;
  return this.save();
}


module.exports = Account = mongoose.model("account", AccountSchema);
