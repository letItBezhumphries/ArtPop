import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import AdminDashboard from "../layout/admin/AdminDashboard";
import BackgroundCarousel from "../UI/BackgroundCarousel";
import { loadGallery } from "../../actions/admin";

const Landing = ({ auth: { isAdmin, loading }, gallery, loadGallery }) => {
  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  if (isAdmin) {
    return <Redirect to="/admin" />;
  }

  return (
    <Fragment>
      {!loading && isAdmin ? (
        <AdminDashboard gallery={gallery} />
      ) : (
        <BackgroundCarousel backgroundImgs={gallery} />
      )}
    </Fragment>
  );
};

Landing.propTypes = {
  isAdmin: PropTypes.bool,
  loadGallery: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  gallery: state.admin.gallery,
});

export default connect(mapStateToProps, { loadGallery })(Landing);
