import axios from "axios";
import {
  LOAD_CART,
  // APPLY_DISCOUNT_FAIL,
  // APPLY_DISCOUNT_SUCCESS,
  CART_ERROR,
  CLEAR_CART,
  REMOVE_FROM_CART_FAIL,
  REMOVE_FROM_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  ADD_TO_CART_SUCCESS,
} from "./types";

export const loadCart = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/shop/my-cart");

    dispatch({ type: LOAD_CART, payload: res.data });
  } catch (err) {
    dispatch({ type: CART_ERROR, payload: err });
  }
};

export const clearCart = () => async (dispatch) => {
  try {
    const res = await axios.delete("api/shop/my-cart");
    dispatch({ type: CLEAR_CART, payload: res.data });
  } catch (err) {
    dispatch({ type: CART_ERROR, payload: err });
  }
};

export const addToCart = (id, quantity, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ quantity: quantity });

    const res = await axios.post(`/api/shop/my-cart/${id}`, body, config);

    dispatch({ type: ADD_TO_CART_SUCCESS, payload: res.data });

    // history.push(`/shop/my-cart`);
  } catch (err) {
    dispatch({ type: ADD_TO_CART_FAIL, payload: err });
  }
};

export const removeFromCart = (id, quantity) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ quantity: quantity });

    const res = await axios.delete(`/api/shop/my-cart/${id}`, body, config);

    console.log(
      "removeFromCart action to api/shop/my-cart, res.data:",
      res.data
    );

    dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: res.data });

    // history.push("/shop/my-cart");
  } catch (err) {
    dispatch({ type: REMOVE_FROM_CART_FAIL, payload: err });
  }
};
