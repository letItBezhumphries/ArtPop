import _ from "lodash";
import React, { Fragment, useEffect } from "react";
import { reduxForm, Field } from "redux-form";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FormField from "../../../UI/FormField";
import artworkFormFields from "../../../../utils/artworkFormFields";
import validate from "../../../../utils/validate";

const ArtworkForm = ({
  upload,
  loading,
  portfolios,
  onCancel,
  onSubmitReview,
  handleSubmit,
  image,
  formValues,
  ...props
}) => {
  const collections = portfolios.map(({ title }) => {
    return title.split("_").join(" ");
  });

  const renderCollectionSelector = ({ input, meta: { touched, error } }) => (
    <Fragment>
      <select {...input}>
        <option value="">Select a Collection...</option>
        {collections.map((val) => (
          <option value={val} key={val}>
            {val}
          </option>
        ))}
      </select>
      {touched && error && <span>{error}</span>}
    </Fragment>
  );

  const renderFields = () => {
    return _.map(artworkFormFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          label={label}
          name={name}
          type="text"
          id={name}
          component={FormField}
        />
      );
    });
  };

  return (
    <Fragment>
      <div className="showcase-form-container">
        <h4 className="large text-primary form-header">
          Artwork Showcase Form
        </h4>

        <form className="showcase-form" onSubmit={handleSubmit(onSubmitReview)}>
          {renderFields()}
          <div className="form-group row">
            <label htmlFor="description" className="col-sm-4 col-form-label">
              Add a description :
            </label>
            <div className="col-sm-10">
              <Field
                placeholder="Add a description"
                className="form-control-lg"
                cols="30"
                rows="5"
                name="description"
                component="textarea"
                id="description"
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="portfolio" className="col-sm-4 col-form-label">
              Collection From? :
            </label>
            <div className="col-sm-10">
              <Field
                className="form-control-lg"
                name="portfolio"
                component={renderCollectionSelector}
              />
            </div>
          </div>

          <div className="form-check row">
            <label className="form-check-label" htmlFor="isGallery">
              Include In the Gallery Carousel? :
            </label>
            <div className="col-sm-10">
              <Field
                className="form-check-input-lg"
                name="isGallery"
                component="input"
                type="checkbox"
                id="isGallery"
              />
            </div>
          </div>
          <div className="form-btns-box">
            <button className="btn btn-primary left-btn" onClick={onCancel}>
              CANCEL
            </button>

            <input
              type="submit"
              className="btn btn-primary right-btn"
              value="REVIEW"
            />
          </div>
        </form>
      </div>
    </Fragment>
  );
};

ArtworkForm.propTypes = {
  upload: PropTypes.object.isRequired,
  portfolios: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  upload: state.upload,
  loading: state.admin.loading,
  portfolios: state.admin.portfolios,
  formValues: state.form.artworkForm.values,
});

export default connect(mapStateToProps)(
  reduxForm({
    validate,
    form: "artworkForm",
    destroyOnUnmount: false,
  })(ArtworkForm)
);
