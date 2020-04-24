import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useHistory, Redirect } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import PaymentSuccess from "./PaymentSuccess";
import PropTypes from "prop-types";
import SelectOptionInput from "../../UI/SelectOptionInput";
import { ErrorResult } from "./ErrorResult";
import { postPaymentIntent, postPaymentMethod } from "../../../actions/order";
import { ELEMENT_OPTIONS } from "../../../utils/stripeConstants";
import getSelectedStateOptions from "../../../utils/getSelectedStateOptions";

const CheckoutForm = ({
  order,
  authUser,
  shipping,
  paymentMethodId,
  customerId,
  postPaymentIntent,
  postPaymentMethod
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [postal, setPostal] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    street: "",
    unit: "",
    city: "",
    state: "",
    country: "US",
    zip: ""
  });
  const {
    id,
    loading,
    user,
    isPaid,
    clientSecret,
    paymentIntent,
    items,
    total
  } = order;

  useEffect(() => {
    console.log(
      "[CheckoutForm.jsx] useEffect - order:",
      order,
      "paymentMethod",
      paymentMethodId,
      authUser,
      customerId
    );
  }, [order]);

  let formfields;

  const handleSelectChange = value => {
    setState(value);
    setShippingDetails({
      ...shippingDetails,
      state: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    //if user wants to save the card for future payments then need to start a different payment flow
    if (isSavingCard) {
      console.log("creatingPaymentMethod");
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: authUser.name || name,
          address: {
            line1: shippingDetails.street,
            line2: shippingDetails.unit,
            city: shippingDetails.city,
            state: shippingDetails.state,
            country: shippingDetails.country,
            postal_code: shippingDetails.zip
          },
          phone: phone,
          email: authUser.email
        }
      });

      if (error) {
        console.log("[error]", error);
        setErrorMessage(error.message);
        setPaymentMethod(null);

        //render error
      } else {
        console.log(
          "[payload] user clicked pay with successfull payment, pm_:",
          paymentMethod
        );
        //here I' am using this action to send the paymentMethod to the server
        //    to attach the paymentMethod to ?
        //``` to an existing customer or new customer that wants to save payments
        //``` or customer that doesn't want to save payemnts
        postPaymentMethod(paymentMethod, shippingDetails, paymentIntent);
        postPaymentIntent(
          paymentMethod,
          "usd",
          isSavingCard,
          shippingDetails,
          paymentIntent
        );
        setErrorMessage(null);
        // return <Redirect to="/payment-success" from="/checkout" />;
      }
    } else {
      console.log("Confirming cardPayment");
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: authUser.name || name,
            address: {
              line1: shippingDetails.street,
              line2: shippingDetails.unit,
              city: shippingDetails.city,
              state: shippingDetails.state,
              country: shippingDetails.country,
              postal_code: shippingDetails.zip
            },
            phone: phone,
            email: authUser.email
          }
        }
      });
      if (result.error) {
        // Show error to your customer
        setErrorMessage(result.error.message);
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // Show a success message to your customer

          //send an email and receipt to your customer, ? provide the endpoint or link to view the receipt

          // save the card to a customer

          console.log(
            "look for the result.paymentIntent.payment_method",
            result.paymentIntent.payment_method
          );

          //save the pm_ to the user or the account as well as the Customer id

          //close out the payment flow

          // There's a risk of the customer closing the window
          // before callback execution. Set up a webhook or plugin

          // return <Redirect to="/payment-success" from="/checkout" />;
        }
      }
    }
  };

  let cardForm = (
    <Fragment>
      <div className="card-form__form-row">
        <label htmlFor="name" className="card-form__label">
          Full Name
        </label>
        <input
          id="name"
          type="name"
          className="card-form__input"
          required
          placeholder="Full Name"
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="card-form__form-row">
        <label htmlFor="cardNumber" className="card-form__label">
          Card Number
        </label>
        <CardNumberElement
          id="cardNumber"
          className="card-form__input"
          options={ELEMENT_OPTIONS}
        />
      </div>
      <div className="card-form__form-row">
        <label htmlFor="expiry" className="card-form__label">
          Card Expiration
        </label>
        <CardExpiryElement
          id="expiry"
          className="card-form__input"
          options={ELEMENT_OPTIONS}
        />
      </div>
      <div className="card-form__form-row">
        <label htmlFor="cvc" className="card-form__label">
          CVC
        </label>
        <CardCvcElement
          id="cvc"
          className="card-form__input"
          options={ELEMENT_OPTIONS}
        />
      </div>
    </Fragment>
  );

  if (shipping === null) {
    formfields = (
      <Fragment>
        <div className="card-form__shipping-section">
          <h3 className="card-form__header lead">
            ENTER YOUR SHIPPING ADDRESS
          </h3>
          <div className="card-form__form-row">
            <label htmlFor="street1" className="card-form__label">
              Street
            </label>
            <input
              id="street1"
              className="card-form__input"
              type="street1"
              placeholder="House number and street name"
              name="street1"
              value={shippingDetails.street}
              onChange={e => {
                setShippingDetails({
                  ...shippingDetails,
                  street: e.target.value
                });
              }}
              required
            />
          </div>
          <div className="card-form__form-row">
            <label htmlFor="unit" className="card-form__label">
              Apartment
            </label>
            <input
              id="unit"
              className="card-form__input"
              type="unit"
              placeholder="Apartment, suite, unit etc (optional)"
              name="unit"
              value={shippingDetails.unit}
              onChange={e => {
                setShippingDetails({
                  ...shippingDetails,
                  unit: e.target.value
                });
              }}
            />
          </div>
          <div className="card-form__form-row">
            <label htmlFor="city" className="card-form__label">
              City
            </label>
            <input
              id="city"
              className="card-form__input"
              type="city"
              placeholder="Town / city"
              name="city"
              value={shippingDetails.city}
              onChange={e => {
                setShippingDetails({
                  ...shippingDetails,
                  city: e.target.value
                });
              }}
              required
            />
          </div>
          <div className="card-form__form-row">
            <label htmlFor="state" className="card-form__label">
              State
            </label>
            <SelectOptionInput
              options={getSelectedStateOptions}
              selectClass={"select-option"}
              onSelectChange={handleSelectChange}
              optionClass={"option-text"}
            />
          </div>

          <div className="card-form__form-row">
            <label htmlFor="zip" className="card-form__label">
              Zipcode
            </label>
            <input
              id="zip"
              className="card-form__input"
              type="zip"
              placeholder="Postcode / zip"
              name="zip"
              value={shippingDetails.zip}
              onChange={e => {
                setShippingDetails({ ...shippingDetails, zip: e.target.value });
              }}
              required
            />
          </div>
          <div className="card-form__form-row">
            <label htmlFor="country" className="card-form__label">
              Country
            </label>
            <input
              id="country"
              className="card-form__input"
              type="country"
              placeholder="United States"
              name="country"
              value={"US"}
              readOnly
            />
          </div>
          <div className="card-form__form-row">
            <label htmlFor="phone" className="card-form__label">
              Telephone Number
            </label>
            <input
              id="phone"
              className="card-form__input"
              type="phone"
              placeholder="Phone"
              name="phone"
              value={phone}
              onChange={e => {
                setPhone(e.target.value);
              }}
              required
            />
          </div>
        </div>

        <div className="card-form__billing-section">
          <p className="card-form__header lead">
            ENTER YOUR CREDIT CARD INFORMATION
          </p>
          {cardForm}
        </div>
      </Fragment>
    );
  } else {
    formfields = (
      <Fragment>
        <div className="card-form__billing-section">
          <p className="card-form__header lead">PAY WITH YOUR CREDIT CARD</p>
          {cardForm}
          <div className="card-form__form-row">
            <label htmlFor="postal" className="card-form__label">
              Postal Code
            </label>
            <input
              id="postal"
              className="card-form__input"
              required
              placeholder="12345"
              value={postal}
              onChange={e => {
                setPostal(e.target.value);
              }}
            />
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <div className="checkout__card-form-container">
      <form className="checkout__card-form card-form" onSubmit={handleSubmit}>
        {formfields}

        {errorMessage && <ErrorResult>{errorMessage}</ErrorResult>}

        <div className="card-form__form-row">
          <label htmlFor="alt-address" className="card-form__save-card-label">
            SAVE CARD FOR FUTURE USE? :
          </label>
          <input
            name="isSavingCard"
            className="card-form__save-card-checkbox"
            style={{ marginLeft: ".5rem", width: "2rem", height: "2rem" }}
            type="checkbox"
            checked={isSavingCard}
            onChange={() => setIsSavingCard(!isSavingCard)}
          />

          <button
            type="submit"
            disabled={!stripe}
            className="card-form__button"
          >
            Pay
          </button>
        </div>
      </form>
    </div>
  );
};

CheckoutForm.propTypes = {
  authUser: PropTypes.object,
  order: PropTypes.object.isRequired,
  postPaymentIntent: PropTypes.func.isRequired,
  postPaymentMethod: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  authUser: state.auth.user,
  order: state.order,
  paymentMethodId: state.account.paymentMethod,
  customerId: state.account.customerId,
  shipping: state.account.shipping
});

export default connect(mapStateToProps, {
  postPaymentIntent,
  postPaymentMethod
})(CheckoutForm);
