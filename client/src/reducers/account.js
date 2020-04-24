import {
  LOAD_ACCOUNT,
  UPDATE_ACCOUNT,
  CLEAR_ACCOUNT,
  DELETE_ACCOUNT,
  ACCOUNT_ERROR,
  ADD_PAYMENT_METHOD_SUCCESS,
  ADD_PAYMENT_METHOD_FAIL,
} from "../actions/types";

const initialState = {
  paymentMethod: null,
  addresses: [],
  shipping: null,
  user: null,
  customerId: "",
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_ACCOUNT:
      // console.log("inside reducer loadAccount()=> payload:", payload);
      return {
        ...state,
        addresses: payload.addresses,
        paymentMethod: payload.paymentMethod,
        customerId: payload.customerId,
        user: payload.user,
        loading: false,
      };
    case ADD_PAYMENT_METHOD_SUCCESS:
      // console.log("inside reducer [account.js], payload", payload);
      return {
        ...state,
        paymentMethod: payload.payment_method,
        loading: false,
      };
    case CLEAR_ACCOUNT:
    case DELETE_ACCOUNT:
      return {
        ...state,
        addresses: [],
        paymentMethod: null,
        user: null,
        loading: false,
      };

    case ADD_PAYMENT_METHOD_FAIL:
    case ACCOUNT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
