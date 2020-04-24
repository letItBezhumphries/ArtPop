import axios from "axios";
import { LOAD_EXHIBITIONS, LOAD_EXHIBITIONS_ERROR } from "./types";

export const loadExhibitions = () => async (dispatch) => {
  try {
    const res = await axios.get("/admin/exhibitions/all");
    dispatch({ type: LOAD_EXHIBITIONS, payload: res.data });
  } catch (err) {
    dispatch({ type: LOAD_EXHIBITIONS_ERROR, payload: err.msg });
  }
};
