import { LOAD_EXHIBITIONS, LOAD_EXHIBITIONS_ERROR } from "../actions/types";

const initialState = {
  loading: true,
  exhibits: null,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_EXHIBITIONS:
      return {
        ...state,
        exhibits: payload,
        loading: false,
      };
    case LOAD_EXHIBITIONS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default: {
      return state;
    }
  }
}
