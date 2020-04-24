import {
  LOAD_IMAGES,
  REQUEST_ERROR,
  PORTFOLIO_ERROR,
  IMAGE_ERROR,
  GET_RELATED_ARTWORK_FAIL,
  GET_RELATED_ARTWORK_SUCCESS,
  CLEAR_RELATED_ARTWORK,
  CLEAR_SELECTED_ARTWORK,
  GET_SELECTED_ARTWORK_SUCCESS,
  GET_SELECTED_ARTWORK_FAIL,
  CLEAR_SEARCH,
  GET_ARTWORK_BY_TITLE_SEARCH,
  GET_ARTWORK_BY_PORTFOLIO_SEARCH,
  // GET_ARTWORK_BY_PRICE_SEARCH,
  SEARCH_IMAGES_ERROR,
} from "../actions/types";

const initialState = {
  loading: true,
  search: [],
  images: [],
  related: [],
  image: null,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_IMAGES:
      return {
        ...state,
        images: payload,
        loading: false,
      };
    case GET_RELATED_ARTWORK_SUCCESS:
      console.log("in reducer, GET_RELATED", payload);
      return {
        ...state,
        related: payload,
        loading: false,
      };
    case GET_SELECTED_ARTWORK_SUCCESS:
      console.log("in reducer, GET_SELECTED", payload);
      // const updatedImage = updateObject(state.image, payload);
      return {
        ...state,
        search: [],
        image: payload,
        loading: false,
      };
    case CLEAR_SELECTED_ARTWORK:
      return {
        ...state,
        image: null,
        loading: false,
      };
    case CLEAR_RELATED_ARTWORK:
      return {
        ...state,
        related: [],
        loading: false,
      };
    case GET_ARTWORK_BY_PORTFOLIO_SEARCH:
      // console.log("in reducer, PORTFOLIO_SEARCH", payload);
      return {
        ...state,
        search: payload,
        loading: false,
      };
    case GET_ARTWORK_BY_TITLE_SEARCH:
      // console.log("in reducers, TITLE_SEARCH", payload);
      return {
        ...state,
        search: payload,
        loading: false,
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        search: [],
        loading: false,
      };
    case SEARCH_IMAGES_ERROR:
    case PORTFOLIO_ERROR:
    case GET_SELECTED_ARTWORK_FAIL:
    case GET_RELATED_ARTWORK_FAIL:
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
