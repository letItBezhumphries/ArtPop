import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ReactComponent as IconUpload } from "../../../../assets/icons/SVG/upload.svg";
import { ReactComponent as IconFileType } from "../../../../assets/icons/SVG/file-jpg.svg";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import Message from "./Message.js";
import Progress from "./Progress.js";
import { uploadImage, createImageShowcase } from "../../../../actions/upload";

const FileUpload = ({
  uploadImage,
  createImageShowcase,
  progress,
  uploadFile,
  upload,
  click,
  handleSubmit,
}) => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  useEffect(() => {
    if (progress > 0) {
      setUploadPercentage(progress);
    }

    if (uploadFile && progress === 100) {
      setUploadedFile(uploadFile);
      setMessage("Image was Successfully Uploaded!");
    }
  }, [progress, upload, uploadFile, uploadedFile]);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    await uploadImage(formData);
    await createImageShowcase(formData);
  };

  return (
    <Fragment>
      <div className="container-fluid">
        {message ? <Message msg={message} /> : null}
        <form
          onSubmit={(e) => handleSubmit(onSubmit(e))}
          className="image-upload-form"
        >
          <div className="image-upload-form__upper-box">
            <div className="image-upload-form__form-group mb-4">
              <input
                type="file"
                className="image-upload-form__file-input"
                name="file"
                id="customFile"
                onChange={onChange}
              />
              <label
                className="image-upload-form__file-label btn btn-primary"
                htmlFor="customFile"
              >
                <IconUpload className="icon-upload" />
                <IconFileType className="icon-fileType" />
                <span className="image-upload-form__label-text">
                  Pick a File...
                </span>
              </label>

              <input
                type="submit"
                value="Upload"
                className="btn btn-primary image-upload-form__btn"
                onClick={click}
              />
            </div>

            {uploadedFile ? (
              <div className="row mt-4">
                <div className="col-md-8 m-auto">
                  <img
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "2rem",
                    }}
                    src={uploadFile ? uploadFile.filePath : null}
                  />
                  <Progress percentage={uploadPercentage} />
                </div>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

FileUpload.propTypes = {
  uploadImage: PropTypes.func.isRequired,
  upload: PropTypes.object,
  progress: PropTypes.number,
  createImageShowcase: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  uploadFile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  uploadFile: state.admin.imageSrc,
  upload: state.upload.upload,
  progress: state.upload.progress,
  loading: state.upload.loading,
});

const validate = (values) => {
  const errors = {};
  if (!values.file) {
    errors.file = "A File is required!";
  }
  return errors;
};

export default connect(mapStateToProps, { uploadImage, createImageShowcase })(
  reduxForm({
    form: "artworkForm",
    destroyOnUnmount: false,
    validate,
  })(FileUpload)
);
