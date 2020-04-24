import React, { Fragment } from "react";

const Notification = ({ items, added, removed }) => {
  let message;

  if (added && removed === null) {
    message = (
      <p className="cart-message--added">
        {added.title}, {added.year} HAS BEEN ADDED TO YOUR CART
      </p>
    );
  } else if (removed && added === null) {
    message = (
      <p className="cart-message--removed">
        {removed.title}, {removed.year} HAS BEEN REMOVED FROM YOUR CART
      </p>
    );
  } else if (items.length === 0) {
    message = (
      <p className="cart-message--empty">YOUR CART IS CURRENTLY EMPTY</p>
    );
  } else {
    return null;
  }

  return (
    <Fragment>
      <div className="notifications">{message}</div>
    </Fragment>
  );
};

export default Notification;
