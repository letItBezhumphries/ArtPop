const calculateOrderTotal = (orderItems) => {
  let total = orderItems.reduce((a, b) => {
    return (a += b.quantity * b.itemId.price);
  }, 0);
  let tax = total * 0.12;
  let orderTotal = total + tax;
  return orderTotal * 100;
};

module.exports = calculateOrderTotal;
