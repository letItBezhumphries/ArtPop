import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import { loadImages } from "../../../actions/admin";
import Dashboard from "./Dashboard";
import AdminRoutes from "./AdminRoutes";

const AdminDashboard = ({ admin, loadImages, ...props }) => {
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const { bgImage, loading } = admin;

  return (
    <div className="bg">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {bgImage === null ? (
            <Fragment>
              <div className="select-bg-modal">
                {/* I need to finish this component that allows new 
              admin user can select the image to use 
              as the dashboard background image */}
                <h4>CURRENTLY YOU HAVE NO DASHBOARD BACKGROUND</h4>
                <h5>SELECT AN IMAGE FOR YOUR BACKGROUND</h5>
              </div>
            </Fragment>
          ) : (
            <div
              className="bgImg"
              style={
                bgImage
                  ? { backgroundImage: `url(${bgImage.imageUrl})`, zIndex: "2" }
                  : null
              }
            >
              <Switch>
                <Route exact path="/admin" component={Dashboard} />
                <Route component={AdminRoutes} />
              </Switch>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  admin: state.admin,
});

export default connect(mapStateToProps, { loadImages })(AdminDashboard);
