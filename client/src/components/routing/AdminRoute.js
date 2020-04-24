import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const AdminRoute = ({
  component: Component,
  auth: { isAuthenticated, isAdmin, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      (!isAuthenticated && !loading) || (!isAdmin && !loading) ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});

export default connect(mapStateToProps)(AdminRoute);
