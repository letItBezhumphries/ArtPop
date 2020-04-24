import axios from "axios";
import { setAlert } from "./alert";
import { clearUpload, removeUpload } from "./upload";
import { loadExhibitions } from "./exhibitions";
import {
  ADD_PORTFOLIO,
  GET_ARTWORK,
  ADD_ARTWORK_SUCCESS,
  ADD_ARTWORK_FAIL,
  PORTFOLIO_ERROR,
  IMAGE_ERROR,
  LOAD_IMAGES,
  LOAD_GALLERY,
  LOAD_PORTFOLIOS,
  REQUEST_ERROR,
} from "./types";

//@route  GET /gallery
//@desc loads the gallery of background images for the Gallery Carousel
export const loadGallery = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/images/gallery");

    dispatch({ type: LOAD_GALLERY, payload: res.data });
  } catch (err) {
    dispatch({ type: REQUEST_ERROR });
  }
};

//@route  GET api/images/shop
//@desc loads all the images for the available inventory in the shop
export const loadImages = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/images/shop");

    dispatch({ type: LOAD_IMAGES, payload: res.data });
  } catch (err) {
    dispatch({ type: REQUEST_ERROR });
  }
};

export const loadPortfolios = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/images/portfolios");

    dispatch({ type: LOAD_PORTFOLIOS, payload: res.data });
  } catch (err) {
    dispatch({ type: PORTFOLIO_ERROR, payload: err });
  }
};

export const loadShop = () => (dispatch) => {
  try {
    dispatch(loadGallery());
    dispatch(loadPortfolios());
    dispatch(loadImages());
    dispatch(loadExhibitions());
  } catch (err) {
    dispatch({ type: REQUEST_ERROR, payload: err });
  }
};

export const getArtwork = (filename) => async (dispatch) => {
  try {
    const res = await axios.get(`/admin/images/${filename}`);

    console.log("IN GET ARTWORK", res.data);

    dispatch({ type: GET_ARTWORK, payload: res.data });
  } catch (err) {
    dispatch({ type: IMAGE_ERROR });
  }
};

//@route  POST admin/upload/artwork
//@desc creates a new Image instance in db that stores the details for a single artwork
export const addArtwork = (formData, edit, history, file) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = {
      ...formData,
      ...file,
    };

    const res = await axios.post("/admin/upload/artwork", body, config);

    console.log("in action addArtwork", res.data);

    dispatch({
      type: ADD_ARTWORK_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert(edit ? "Artwork Updated" : "Artwork Created", "success"));

    // dispatch(removeUpload(file));

    dispatch(clearUpload());

    history.goBack();
    history.goBack();
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: ADD_ARTWORK_FAIL,
      payload: err,
    });
  }
};

export const addPortfolio = ({ title, description }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ title, description });

  try {
    const res = await axios.post("/admin/upload/portfolio", body, config);

    dispatch({
      type: ADD_PORTFOLIO,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PORTFOLIO_ERROR,
    });
  }
};
