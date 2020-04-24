import {
  ADD_PORTFOLIO,
  ADD_IMAGE,
  GET_ARTWORK,
  ADD_ARTWORK_SUCCESS,
  ADD_ARTWORK_FAIL,
  EDIT_ARTWORK,
  DELETE_ARTWORK,
  REQUEST_ERROR,
  PORTFOLIO_ERROR,
  IMAGE_ERROR,
  LOAD_IMAGES,
  LOAD_GALLERY,
  LOAD_PORTFOLIOS,
  LOAD_UPLOADED_IMAGE,
  CLEAR_UPLOAD,
} from "../actions/types";

const initialState = {
  loading: true,
  portfolios: [],
  portfolio: null,
  bgImage: null,
  gallery: [],
  // coupons: [],
  // coupon: null,
  artwork: null,
  images: [],
  imageSrc: null,
  image: null,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PORTFOLIO:
      return {
        ...state,
        portfolios: [payload, ...state.portfolios],
        loading: false,
      };
    case LOAD_GALLERY:
      return {
        ...state,
        gallery: payload,
        loading: false,
      };
    case LOAD_IMAGES:
      //hardcoded --need to change this later
      const bgImg = payload[5];
      return {
        ...state,
        bgImage: bgImg,
        images: payload,
        loading: false,
      };
    case GET_ARTWORK:
      return {
        ...state,
        artwork: payload,
        loading: false,
      };
    case ADD_ARTWORK_SUCCESS:
      return {
        ...state,
        images: [...state.images, payload],
        imageSrc: null,
        loading: false,
      };
    case ADD_ARTWORK_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case LOAD_PORTFOLIOS:
      return {
        ...state,
        portfolios: payload,
        loading: false,
      };
    case LOAD_UPLOADED_IMAGE:
      return {
        ...state,
        loading: false,
        imageSrc: payload,
      };
    case PORTFOLIO_ERROR:
    case IMAGE_ERROR:
    case REQUEST_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default: {
      return state;
    }
  }
}
