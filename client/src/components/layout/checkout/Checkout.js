import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CouponInput from "../cart/CouponInput";
import Spinner from "../../UI/Spinner";
import Login from "../../auth/Login";
import BillingDetailsForm from "./BillingDetailsForm";
import CheckoutSummary from "./CheckoutSummary";
import { ELEMENTS_OPTIONS } from "../../../utils/stripeConstants";
import { createOrder } from "../../../actions/order";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Checkout = ({
  cart,
  order,
  user,
  shipping,
  loading,
  paymentMethod,
  createOrder,
}) => {
  let location = useLocation();
  const [showCoupon, setShowCoupon] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (cart.items.length > 0) {
      createOrder(cart.items, paymentMethod);
    }
  }, [cart.items]);

  const toggleShowCouponClick = (showCoupon) => setShowCoupon(!showCoupon);

  const toggleShowLoginClick = (showLogin) => setShowLogin(!showLogin);

  return (
    <Fragment>
      {loading && order === null ? (
        <Spinner />
      ) : (
        <section className="checkout AppWrapper">
          <h2 className="cart__heading checkout__heading">Checkout</h2>
          <div className="checkout__options">
            <div className="checkout__option">
              RETURNING CUSTOMER?{" "}
              <span
                className="checkout__login-toggle"
                onClick={() => toggleShowLoginClick(showLogin)}
              >
                CLICK HERE TO LOGIN
              </span>
            </div>
            <div className="checkout__option">
              <div className="checkout__coupon-option">
                <label htmlFor="btn-toggle-coupon">HAVE A COUPON? </label>
                <span
                  className="btn-toggle-coupon"
                  onClick={() => toggleShowCouponClick(showCoupon)}
                >
                  CLICK HERE TO ENTER YOUR CODE
                </span>
              </div>
            </div>
            {showCoupon && (
              <div className="checkout__coupon-input-panel">
                <CouponInput />
              </div>
            )}
            {showLogin && (
              <div className="checkout__collapsible-panel">
                <Login check_login={showLogin} location={location} />
              </div>
            )}
            {!shipping && <BillingDetailsForm />}
          </div>

          <CheckoutSummary />
          <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
            <CheckoutForm />
          </Elements>
        </section>
      )}
    </Fragment>
  );
};

Checkout.propTypes = {
  order: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  user: PropTypes.object,
  paymentMethod: PropTypes.string,
  createOrder: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  order: state.order,
  cart: state.cart,
  user: state.auth.user,
  paymentMethod: state.account.paymentMethod,
  loading: state.cart.loading,
});

export default connect(mapStateToProps, { createOrder })(withRouter(Checkout));
// // //There’s also a useEffect call that scrolls the document to the top when
// // //the page mounts for the first time. This is necessary because react-router-dom
// // //preserves the previous scroll state when you switch routes.
