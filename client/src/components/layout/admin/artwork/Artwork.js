import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import PropTypes from "prop-types";
import FileUpload from "./FileUpload";
import ArtworkForm from "./ArtworkForm";
import ArtworkFormReview from "./ArtworkFormReview";
import Spinner from "../../../UI/Spinner";
import Sidebar from "../../../UI/Sidebar";

const Artwork = ({ loading, bgImage }) => {
  const [showUploadActions, setShowUploadActions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleUploadClick = (show) => {
    setShowUploadActions(!show);
  };

  const handleContinueClick = (showForm) => {
    setShowForm(!showForm);
  };

  const handleReviewFormClick = (showReview) => {
    setShowReview(!showReview);
  };

  const handleCancelFormClick = (showForm) => {
    setShowForm(!showForm);
  };

  const renderFormContent = () => {
    if (showReview) {
      return (
        <ArtworkFormReview onCancel={() => handleReviewFormClick(showReview)} />
      );
    }
    return (
      <ArtworkForm
        onCancel={() => handleCancelFormClick(showForm)}
        onSubmitReview={() => handleReviewFormClick(showReview)}
      />
    );
  };

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg">
          <div
            className="bgImg"
            style={
              bgImage
                ? {
                    backgroundImage: `url(${bgImage.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: "2",
                  }
                : null
            }
          >
            <section className="artwork-page">
              <Sidebar />

              <div className="artwork-page__forms-container">
                {!showForm ? (
                  <Fragment>
                    <h5 className="artwork-page__header">
                      Add new artwork to showcase and sell in your shop
                    </h5>
                    <FileUpload
                      click={() => handleUploadClick(showUploadActions)}
                    />
                    {showUploadActions && !showForm ? (
                      <Fragment>
                        <div className="artwork-page__form-actions">
                          <p className="artwork-page__save-prompt">
                            Correct Image File? If yes, click Proceed
                          </p>
                          <div className="artwork-page__actions">
                            <button
                              onClick={() => handleContinueClick(showForm)}
                              className="btn btn-primary artwork-page__cancel-btn"
                            >
                              CANCEL
                            </button>
                            <button
                              onClick={() => handleContinueClick(showForm)}
                              className="btn btn-primary artwork-page__continue-btn"
                            >
                              PROCEED
                            </button>
                          </div>
                        </div>
                      </Fragment>
                    ) : null}
                  </Fragment>
                ) : (
                  <Fragment>{renderFormContent()}</Fragment>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Artwork.propTypes = {
  bgImage: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.admin.loading,
  bgImage: state.admin.bgImage,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "artworkForm",
  })(Artwork)
);
