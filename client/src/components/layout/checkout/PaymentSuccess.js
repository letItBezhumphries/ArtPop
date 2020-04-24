import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import Spinner from "../../UI/Spinner";

const PaymentSuccess = ({ account, user, order, loading }) => {
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className="success-page">
            <h2 className="success-page__header">
              Your Payment was Successfull!
            </h2>
            <div className="success-page__receipt-container">
              Your receipt should be here!!
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  account: state.account,
  user: state.user,
  order: state.order,
  loading: state.order.loading
});

export default connect(mapStateToProps)(PaymentSuccess);
