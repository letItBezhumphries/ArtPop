import React from "react";

export default ({ input, label, meta: { error, touched }, ...props }) => {
  return (
    <div className="form-group row">
      <label htmlFor="" className="col-sm-2 col-form-label">
        {label}
      </label>
      <div className="col-sm-10">
        <input {...input} style={{ marginBottom: ".5rem" }} />
      </div>

      <div style={{ marginBottom: "20px" }}>{touched && error}</div>
    </div>
  );
};
