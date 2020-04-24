import alert from "./alert";
import auth from "./auth";
import admin from "./admin";
import shop from "./shop";
import cart from "./cart";
import account from "./account";
import order from "./order";
import upload from "./upload";
import exhibitions from "./exhibitions";
import { reducer as reduxForm } from "redux-form";
import { combineReducers } from "redux";

export default combineReducers({
  alert,
  auth,
  admin,
  upload,
  shop,
  cart,
  account,
  order,
  exhibitions,
  form: reduxForm,
});
