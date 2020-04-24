import axios from "axios";
import {
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  ADD_PAYMENT_METHOD_SUCCESS,
  ADD_PAYMENT_METHOD_FAIL,
  INIT_PAYMENT_INTENT_SUCCESS,
  INIT_PAYMENT_INTENT_FAIL,
  CREATE_PAYMENT_INTENT_FAIL,
  CREATE_PAYMENT_INTENT_SUCCESS,
} from "./types";
import { setAlert } from "./alert";
import { clearCart } from "./cart";

export const initPaymentIntent = (id, paymentMethod) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      currency: "usd",
      payment_method_id: paymentMethod,
    });

    const res = await axios.post(`/api/shop/order/${id}`, body, config);

    // console.log('in action initPaymentIntent, res.data:', res.data);

    dispatch({ type: INIT_PAYMENT_INTENT_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: INIT_PAYMENT_INTENT_FAIL, payload: err });
  }
};

export const postPaymentIntent = (
  paymentMethod,
  currency,
  isSavingCard,
  shipping,
  paymentIntent
) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // let id = paymentMethod.id;
    console.log(
      "in action postPaymentIntent [arguments passed] paymentMethod:",
      paymentMethod,
      "currency:",
      currency,
      "shipping:",
      shipping,
      "isSavingCard:",
      isSavingCard,
      "paymentIntent:",
      paymentIntent
    );

    const body = JSON.stringify({
      payment_method_id: paymentMethod.id,
      payment_intent_id: paymentIntent,
      currency: "usd",
      isSavingCard: isSavingCard,
      shipping: shipping,
    });

    const res = await axios.post("/api/stripe/payment", body, config);

    console.log("action [order.js] createPaymentIntent", res.data);

    dispatch({ type: CREATE_PAYMENT_INTENT_SUCCESS, payload: res.data });

    //should set it up so that the receipt_url is sent back to the client
    //which can be added to the success page
  } catch (err) {
    dispatch({ type: CREATE_PAYMENT_INTENT_FAIL, payload: err });
  }
};

export const createOrder = (items, payment_method_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      items,
    });

    const res = await axios.post("/api/shop/order", config, body);

    console.log("in [order.js] action createOrder, res.data:", res.data);

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: res.data });

    dispatch(clearCart());

    dispatch(initPaymentIntent(res.data._id, payment_method_id));
  } catch (err) {
    dispatch({ type: CREATE_ORDER_FAIL, payload: err });
  }
};

export const postPaymentMethod = (
  paymentMethod,
  shipping,
  paymentIntent
) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      payment_method_id: paymentMethod,
      shipping: shipping,
      payment_intent_id: paymentIntent,
    });

    // if (shipping) {
    //   dispatch(addAddress(shipping));
    // }

    //send to api/stripe/payment-method
    const res = await axios.post("/api/stripe/payment-method", body, config);

    console.log("in postPaymentMethod action, res.data:", res.data);

    dispatch({
      type: ADD_PAYMENT_METHOD_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: ADD_PAYMENT_METHOD_FAIL,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
