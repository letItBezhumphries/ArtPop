import {
  SET_UPLOAD_PROGRESS,
  IMAGE_UPLOAD,
  CLEAR_UPLOAD,
  IMAGE_UPLOAD_ERROR,
} from "../actions/types";

const initialState = {
  loading: true,
  upload: null,
  progress: 0,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_UPLOAD_PROGRESS:
      return {
        ...state,
        loading: false,
        progress: payload,
      };
    case IMAGE_UPLOAD:
      return {
        ...state,
        loading: false,
        upload: payload,
        progress: 0,
      };
    case CLEAR_UPLOAD:
      return {
        ...state,
        loading: false,
        upload: null,
        progress: 0,
      };
    case IMAGE_UPLOAD_ERROR:
      return {
        ...state,
        loading: false,
        upload: null,
        error: payload,
      };
    default: {
      return state;
    }
  }
}
