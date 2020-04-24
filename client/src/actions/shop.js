import axios from "axios";
import {
  LOAD_IMAGES,
  GET_SELECTED_ARTWORK_SUCCESS,
  GET_SELECTED_ARTWORK_FAIL,
  CLEAR_SELECTED_ARTWORK,
  GET_RELATED_ARTWORK_SUCCESS,
  GET_RELATED_ARTWORK_FAIL,
  REQUEST_ERROR,
  CLEAR_SEARCH,
  SEARCH_IMAGES_ERROR,
  GET_ARTWORK_BY_TITLE_SEARCH,
  GET_ARTWORK_BY_PORTFOLIO_SEARCH,
  SORT_ARTWORK_BY_PRICE_RANGE,
  SORT_ERROR,
  CLEAR_RELATED_ARTWORK,
} from "./types";

export const loadImages = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/images/shop");

    dispatch({ type: LOAD_IMAGES, payload: res.data });
  } catch (err) {
    dispatch({ type: REQUEST_ERROR });
  }
};

export const getSelectedArtwork = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/images/shop/artwork/${id}`);

    // console.log('this is the res.data in getSelected', res.data);

    dispatch({ type: GET_SELECTED_ARTWORK_SUCCESS, payload: res.data });

    dispatch(getRelatedArtwork(res.data.portfolio, id));
  } catch (err) {
    dispatch({ type: GET_SELECTED_ARTWORK_FAIL, payload: err });
  }
};

//clears the state shop.image related and search fields
export const clearSelectedArtwork = () => (dispatch) => {
  try {
    dispatch({ type: CLEAR_SELECTED_ARTWORK });
    dispatch({ type: CLEAR_RELATED_ARTWORK });
    dispatch({ type: CLEAR_SEARCH });
  } catch (err) {
    dispatch({ type: REQUEST_ERROR, payload: err });
  }
};

//to get all the images from the same portfolio/collection except the image that has been selected title
export const getRelatedArtwork = (portfolio, imageId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/images/portfolios/${portfolio}`);

    const images = res.data[0].images;

    const portfolioRelated = images.filter((img) => img._id !== imageId);

    dispatch({
      type: GET_RELATED_ARTWORK_SUCCESS,
      payload: portfolioRelated,
    });
  } catch (err) {
    dispatch({ type: GET_RELATED_ARTWORK_FAIL, payload: err });
  }
};

//clears the state shop.search field
export const clearSearchResults = () => (dispatch) => {
  try {
    dispatch({ type: CLEAR_SEARCH });
  } catch (err) {
    dispatch({ type: REQUEST_ERROR, payload: err });
  }
};

//gets a single image by searching the title --this should load a single ArtworkView with image that matches the searched title
export const searchByTitle = (title, history) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/images/shop/artwork/s/${title}`);

    dispatch({ type: GET_ARTWORK_BY_TITLE_SEARCH, payload: res.data });

    let imageId = res.data._id;

    console.log("searchImagesByTitle res.data:", imageId);

    dispatch(getSelectedArtwork(imageId));

    history.push(`/shop/artwork/${imageId}`);
  } catch (err) {
    dispatch({ type: SEARCH_IMAGES_ERROR, payload: err });
  }
};

// get images that match the search filter for selected portfolio title
export const searchByPortfolio = (portfolio, imageId) => async (dispatch) => {
  try {
    // console.log("searchImagesByPortfolio, portfolio:", portfolio);

    const res = await axios.get(`/api/images/portfolios/${portfolio}`);

    const images = res.data[0].images;

    dispatch({ type: GET_ARTWORK_BY_PORTFOLIO_SEARCH, payload: images });
  } catch (err) {
    dispatch({ type: SEARCH_IMAGES_ERROR, payload: err });
  }
};

export const sortArtworkByPriceRange = (min, max) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/images/shop/artwork/s?min=${min}&max=${max}`
    );
    console.log("sort, pricerange:", res.data);

    dispatch({ type: SORT_ARTWORK_BY_PRICE_RANGE, payload: res.data });
  } catch (err) {
    dispatch({ type: SORT_ERROR, payload: err });
  }
};
