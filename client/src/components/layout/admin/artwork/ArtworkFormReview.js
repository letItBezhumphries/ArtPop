import _ from "lodash";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { addArtwork } from "../../../../actions/admin";
import artworkFormFields from "../../../../utils/artworkFormFields";
import transformNumToFormattedString from "../../../../utils/transformNumToFormattedString";

const ArtworkFormReview = ({
  onCancel,
  addArtwork,
  formValues,
  uploadFile,
  upload,
  history,
}) => {
  let form;
  let file;
  useEffect(() => {
    if (upload) {
      form = {
        ...formValues,
        ...upload.data,
      };
      file = {
        ...upload.file,
      };
    }
  }, [upload, uploadFile]);

  const reviewFields = _.map(artworkFormFields, ({ label, name }) => {
    return (
      <div key={name} className="artwork-form-review__detail row">
        <label className="artwork-form-review__label font-weight-bold col-form-label">
          {label}
        </label>
        <div className="artwork-form-review__value border-bottom col">
          {name === "price"
            ? "$ " + transformNumToFormattedString(formValues[name])
            : formValues[name]}
        </div>
      </div>
    );
  });

  let inputResponse;
  if (formValues.isGallery) {
    inputResponse = "Yes";
  } else {
    inputResponse = "No";
  }

  return (
    <div className="artwork-form-review">
      <div className="artwork-form-review__content">
        <div className="artwork-form-review__left-side">
          <img
            src={uploadFile ? uploadFile.filePath : null}
            alt={"Artwork"}
            className="artwork-form-review__left-side-img"
          />
        </div>

        <div className="artwork-form-review__right-side">
          {reviewFields}
          <div className="artwork-form-review__detail row">
            <label className="artwork-form-review__label font-weight-bold col-form-label">
              Collection:
            </label>
            <div className="artwork-form-review__value border-bottom col">
              {formValues.portfolio}
            </div>
          </div>
          <div className="artwork-form-review__detail row">
            <label className="artwork-form-review__label font-weight-bold col-form-label">
              Include in Gallery Carousel:
            </label>
            <div className="artwork-form-review__value border-bottom col">
              {inputResponse}
            </div>
          </div>
        </div>
      </div>

      <h5 className="artwork-form-review__header">
        Review Artwork Details Before You Submit
      </h5>

      <div className="artwork-form-review__form-actions">
        <button className="btn btn-primary back-btn" onClick={onCancel}>
          BACK
        </button>
        <Link
          to="/admin/artwork"
          style={{ textDecoration: "none" }}
          className="btn btn-primary submit-btn"
          onClick={() => addArtwork(form, true, history, file)}
        >
          SUBMIT ARTWORK
        </Link>
      </div>
    </div>
  );
};

ArtworkFormReview.propTypes = {
  addArtwork: PropTypes.func.isRequired,
  upload: PropTypes.object,
  uploadFile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  formValues: state.form.artworkForm.values,
  uploadFile: state.admin.imageSrc,
  upload: state.upload.upload,
});

export default connect(mapStateToProps, { addArtwork })(
  withRouter(ArtworkFormReview)
);
