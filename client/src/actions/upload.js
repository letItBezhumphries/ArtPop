import axios from "axios";
import axios_thumbs from "../axios-thumbs";
//need to import the firebase storage

import {
  SET_UPLOAD_PROGRESS,
  IMAGE_UPLOAD,
  IMAGE_UPLOAD_ERROR,
  LOAD_UPLOADED_IMAGE,
  CLEAR_UPLOAD,
  CREATE_IMAGE_THUMBNAILS,
  CREATE_IMAGE_THUMBNAILS_ERROR,
} from "./types";

import { setAlert } from "./alert";

export const setUploadPercentage = (percentage) => (dispatch) => {
  try {
    dispatch({ type: SET_UPLOAD_PROGRESS, payload: percentage });
  } catch (err) {
    dispatch({ type: IMAGE_UPLOAD_ERROR, payload: err });
  }
};

//@desc this loads the image fileName and filePath to the redux store at start of Adding Artwork Form
export const createImageShowcase = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post("/admin/upload/image", formData, config);

    dispatch({ type: IMAGE_UPLOAD, payload: res.data });

    dispatch(setAlert(res.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({ type: IMAGE_UPLOAD_ERROR, payload: err });
  }
};

export const uploadImage = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        dispatch(
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          )
        );
        // Clear percentage
        setTimeout(() => dispatch(setUploadPercentage(0), 10000));
      },
    };

    //create thumbnails for new image
    dispatch(createThumbnails(formData));

    const res = await axios.post("/upload", formData, config);

    console.log("in action imageUpload => res.data:", res.data);

    dispatch({ type: LOAD_UPLOADED_IMAGE, payload: res.data });

    dispatch(setAlert("Image Successfully uploaded", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(err.msg, "danger")));
    }
    dispatch({ type: IMAGE_UPLOAD_ERROR, payload: err });
  }
};

/*

*/
export const createThumbnails = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("inside createThumbnails:", formData);

    // const res = await axios_thumbs.post("/images.json", formData, config);

    dispatch({ type: CREATE_IMAGE_THUMBNAILS, payload: res.data });

    dispatch(setAlert("Thumbnails post request to Firebase", "success"));
  } catch (err) {
    dispatch({ type: CREATE_IMAGE_THUMBNAILS_ERROR, payload: err });
  }
};

export const clearUpload = (formData) => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_UPLOAD });

    dispatch(setAlert("Upload has been cleared!", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(err.msg, "danger")));
    }
    dispatch({ type: IMAGE_UPLOAD_ERROR, payload: err });
  }
};

// export const removeUpload = (formData) => async (dispatch) => {
//   try {
//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     };

//     const res = await axios.delete("/upload", formData, config);

//     dispatch(setAlert(res.data.msg, "success"));
//   } catch (err) {
//     const errors = err.response.data.errors;
//     if (errors) {
//       errors.forEach((error) => dispatch(setAlert(err.msg, "danger")));
//     }
//     dispatch({ type: IMAGE_UPLOAD_ERROR, payload: err });
//   }
// };
