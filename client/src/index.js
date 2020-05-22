import React from "react";
import ReactDOM from "react-dom";
import "./styles/sass/main.scss";
// import axios from "axios";
import App from "./App";

// axios.interceptors.request.use(
//   (request) => {
//     console.log("request :>> ", request);
//     //edit request config
//     return request;
//   },
//   (error) => {
//     console.log("error :>> ", error);
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   (response) => {
//     console.log("request :>> ", response);
//     //edit response config
//     return response;
//   },
//   (error) => {
//     console.log("error :>> ", error);
//     return Promise.reject(error);
//   }
// );

ReactDOM.render(<App />, document.getElementById("root"));
