import axios from "axios";
import {
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  GET_ORDER,
  GET_ORDERS,
  DELETE_ORDER,
  CLEAR_CURRENT_ORDER,
  ORDER_ERROR,
  CREATE_PAYMENT_INTENT_SUCCESS,
  CREATE_PAYMENT_INTENT_FAIL,
  INIT_PAYMENT_INTENT_FAIL,
  INIT_PAYMENT_INTENT_SUCCESS
} from "../actions/types";

const initialState = {
  loading: true,
  id: null,
  items: null,
  total: 0,
  user: null,
  orderDate: null,
  isPaid: false,
  transactionId: null,
  paymentIntent: null,
  clientSecret: null,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ORDER: 
    // console.log("order reducer payload:", payload);
    let { _id, items, user, totalCost, isPaid, clientSecret, paymentIntent, orderDate } = payload;
      return {
        ...state,
        loading: false,
        id: _id,
        items: items,
        total: totalCost,
        user: user,
        isPaid: isPaid,
        orderDate: orderDate,
        clientSecret: clientSecret,
        paymentIntent: paymentIntent
      }
    case CREATE_ORDER_SUCCESS: 
      console.log('order reducer, payload:', payload);
      return {
        ...state,
        loading: false,
        id: payload._id,
        items: payload.items,
        user: payload.user,
        total: payload.totalCost,
        isPaid: payload.isPaid,
        orderDate: payload.orderDate
      };
    case INIT_PAYMENT_INTENT_SUCCESS:   
      console.log("in [order.js] reducer, INIT_PAYMENT_INTENT_SUCESS payload:", payload);
      return {
        ...state,
        loading: false,
        paymentIntent: payload.payment_intent_id,
        clientSecret: payload.client_secret
      }
    case CREATE_PAYMENT_INTENT_SUCCESS: 
      console.log("in [order.js] reducer, CREATE_INTENT_SUCCESS payload:", payload);
      return {
        ...state,
        loading: false,
        isPaid: true
      }
    case CLEAR_CURRENT_ORDER:
      console.log('the current order is being cleared');
      return {
        ...state,
        loading: true,
        id: null,
        items: null,
        total: 0,
        user: null,
        orderDate: null,
        isPaid: false,
        clientSecret: null,
        paymentIntent: null,  
        error: {}
      };
    case CREATE_PAYMENT_INTENT_FAIL:
    case CREATE_ORDER_FAIL:
    case INIT_PAYMENT_INTENT_FAIL:
      console.log('in order.js reducer CREATE_PAYMENT_INTENT_FAIL: payload:', payload);
      return {
        ...state,
        error: payload,
        loading: false
        }
    default: {
      return state;
    }
  }
}