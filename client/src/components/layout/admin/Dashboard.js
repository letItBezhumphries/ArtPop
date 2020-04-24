import React, { Fragment } from "react";
import { connect } from "react-redux";
import Spinner from "../../UI/Spinner";
import { Link } from "react-router-dom";

const Dashboard = ({ auth, ...props }) => {
  const { loading, user } = auth;

  return (
    <div className="admin-dashboard">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className="admin-dashboard__header-box">
            <h2 className="admin-dashboard__primary u-center-text">
              Welcome {user.name}!
            </h2>
            <h4 className="admin-dashboard__primary-sub">
              What would you like to do today?
            </h4>
          </div>

          <div className="admin-dashboard__content">
            <div className="admin-dashboard__link-group">
              <Link to="/admin/collections" style={{ textDecoration: "none" }}>
                <button className="admin-dashboard__actions-btn btn">
                  ADD, EDIT OR REMOVE A COLLECTION OF ARTWORK
                </button>
              </Link>

              <Link to="/admin/artwork" style={{ textDecoration: "none" }}>
                <button className="admin-dashboard__actions-btn btn">
                  ADD, EDIT OR REMOVE ARTWORK IN YOUR SHOP
                </button>
              </Link>

              <Link to="/admin/coupons" style={{ textDecoration: "none" }}>
                <button className="admin-dashboard__actions-btn btn">
                  ADD, EDIT OR REMOVE COUPON
                </button>
              </Link>

              <Link to="/admin/exhibitions" style={{ textDecoration: "none" }}>
                <button className="admin-dashboard__actions-btn btn">
                  ADD, EDIT OR REMOVE AN UPCOMING EXHIBITION
                </button>
              </Link>

              <Link to="/admin/orders" style={{ textDecoration: "none" }}>
                <button className="admin-dashboard__actions-btn btn">
                  REVIEW ORDERS & SALES
                </button>
              </Link>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
