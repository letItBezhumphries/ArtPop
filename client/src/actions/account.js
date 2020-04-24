import axios from "axios";
import {
  LOAD_ACCOUNT,
  // UPDATE_ACCOUNT,
  // DELETE_ACCOUNT,
  CLEAR_ACCOUNT,
  ACCOUNT_ERROR,
  // ADD_PAYMENT_METHOD_SUCCESS,
  // ADD_PAYMENT_METHOD_FAIL,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAIL,
} from "./types";
import { setAlert } from "./alert";

export const loadAccount = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_ACCOUNT });

    const res = await axios.get("/api/shop/my-account");

    dispatch({ type: LOAD_ACCOUNT, payload: res.data });
  } catch (err) {
    dispatch({ type: ACCOUNT_ERROR, payload: err });
  }
};

//to add or update an address for a users account
export const addAddress = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put(
      "/api/shop/my-account/add-address",
      formData,
      config
    );

    //SHOULD DISPATCH updateAccount action instead below

    dispatch({
      type: ADD_ADDRESS_SUCCESS,
      payload: res.data,
    });

    dispatch(setAlert("Address Added", "success"));

    // history.push("/");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: ADD_ADDRESS_FAIL,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// export const createCustomer = (email) => async dispatch => {
//   try {
//     const config = {
//       headers: {
//         "Content-Type": "application/json"
//       }
//     };

//     const body = JSON.stringify({

//     });

//     const res = await axios.post("/api/stripe/new_customer", body, config);

//     dispatch({ type: CREATE_CUSTOMER_SUCCESS, payload: res.data });
//   } catch (err) {

//   }
// }
