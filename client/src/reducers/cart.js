import {
  LOAD_CART,
  APPLY_DISCOUNT_FAIL,
  APPLY_DISCOUNT_SUCCESS,
  CART_ERROR,
  CLEAR_CART,
  REMOVE_FROM_CART_FAIL,
  REMOVE_FROM_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  ADD_TO_CART_SUCCESS,
} from "../actions/types";

const initialState = {
  items: [],
  total: 0,
  itemsCount: 0,
  discount: 0,
  coupon: null,
  loading: true,
  added: null,
  removed: null,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_CART:
      // console.log('in loadCart() reducer payload:', payload);
      return {
        ...state,
        items: payload.items,
        itemsCount: payload.itemsCount,
        total: payload.total,
        loading: false,
      };
    case ADD_TO_CART_SUCCESS:
      let { item, cart } = payload;
      console.log("in addToCart() Reducer, cart.items:", cart.items);
      return {
        ...state,
        items: [...cart.items],
        total: cart.total,
        itemsCount: cart.itemsCount,
        loading: false,
        added: item,
        removed: null,
      };
    case REMOVE_FROM_CART_SUCCESS:
      console.log("in removeFromCart reducer, payload:", payload);
      let newCart = payload.cart;
      let removedItem = payload.item;
      return {
        ...state,
        items: [...newCart.items],
        total: newCart.total,
        itemsCount: newCart.itemsCount,
        loading: false,
        added: null,
        removed: removedItem,
      };
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        itemsCount: 0,
        loading: false,
        added: null,
        removed: null,
      };
    // case APPLY_DISCOUNT_SUCCESS:
    //   return {
    //     ...state,
    //     total: state.total - discount,
    //     loading: false
    //   };
    case ADD_TO_CART_FAIL:
    // case APPLY_DISCOUNT_FAIL:
    case REMOVE_FROM_CART_FAIL:
    case CART_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
}
