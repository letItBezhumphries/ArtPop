import React, { Fragment } from "react";

const CouponInput = ({ click }) => {
  return (
    <Fragment>
      <input
        style={{
          fontSize: "1.3rem",
          margin: "0rem 1.5rem",
          padding: ".5rem 1.3rem",
          outline: "none",
          border: "none",
          width: "20rem",
        }}
        placeholder="coupon code"
        name="coupon"
      ></input>
      <button
        className="details-box__button button button-white"
        type="button"
        onClick={(e) => click(e.target.value)}
      >
        Apply Coupon
      </button>
    </Fragment>
  );
};

export default CouponInput;
