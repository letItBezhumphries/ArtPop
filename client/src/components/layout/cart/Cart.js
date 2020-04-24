import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";
import Notification from "../../UI/Notification";
import Spinner from "../../UI/Spinner";
import { loadCart } from "../../../actions/cart";
import { clearSelectedArtwork } from "../../../actions/shop";

const Cart = ({ cart, loadCart, clearSelectedArtwork }) => {
  const { items, loading, added, removed } = cart;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCart();
  }, [loadCart]);

  return (
    <Fragment>
      {loading && cart === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <section className="cart">
            <h2 className="cart__heading">Cart</h2>
            {items.length > 0 ? (
              <Fragment>
                <div className="cart__notices-box notices-box">
                  <Notification added={added} removed={removed} items={items} />
                  <Link
                    to="/shop/inventory"
                    style={{ textDecoration: "none" }}
                    className="notices-box__button button button-white"
                    onClick={clearSelectedArtwork}
                  >
                    Continue Shopping
                  </Link>
                </div>
                <CartItemsList cartItems={items} />
                <CartSummary />
              </Fragment>
            ) : (
              <Fragment>
                <Notification items={items} added={added} removed={removed} />
                <p className="return-to-shop">
                  <Link
                    to="/shop/inventory"
                    style={{ textDecoration: "none" }}
                    className="notices-box__button button button-white"
                    onClick={clearSelectedArtwork}
                  >
                    Return to Shop
                  </Link>
                </p>
              </Fragment>
            )}
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

Cart.propTypes = {
  auth: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  loadCart: PropTypes.func.isRequired,
  clearSelectedArtwork: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cart: state.cart,
  auth: state.auth,
  image: state.shop.image
});

export default connect(mapStateToProps, { loadCart, clearSelectedArtwork })(
  Cart
);
