import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SelectOptionInput from "../../UI/SelectOptionInput";
import getSelectedStateOptions from "../../../utils/getSelectedStateOptions";

const BillingDetailsForm = ({ shipping, loading }) => {
  const [showAlternateShipping, setShowAlternateShipping] = useState(false);

  const [formData, setFormData] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    telephone: "",
  });

  const { street1, street2, city, state, zip, telephone } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // addShipping(formData);
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, state: value });
  };

  const toggleShowAlternateShipping = (showAlternateShipping) =>
    setShowAlternateShipping(!showAlternateShipping);

  return (
    <div className="billing">
      <form className="billing-form" onSubmit={onSubmit}>
        <div className="billing-form__col-1-of-2">
          <h3 className="billing-form__header lead">BILLING DETAILS</h3>
        </div>

        <div className="billing-form__col-2-of-2">
          <input
            name="alt-address"
            className="billing-form__show-shipping-checkbox"
            type="checkbox"
            checked={showAlternateShipping}
            onChange={() => toggleShowAlternateShipping(showAlternateShipping)}
          />
          <label className="billing-form__input-label" htmlFor="alt-address">
            SHIP TO A DIFFERENT ADDRESS?
          </label>

          <br />
          {showAlternateShipping && (
            <div className="billing-form__alt-shipping-fields col-2-of-2">
              <div className="form-group">
                <label htmlFor="street1">Street</label>
                <input
                  id="street1"
                  type="street1"
                  placeholder="House number and street name"
                  name="street1"
                  value={street1}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="street2">Apartment</label>
                <input
                  id="street2"
                  type="street2"
                  placeholder="Apartment, suite, unit etc (optional)"
                  name="street2"
                  value={street2}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="city"
                  placeholder="Town / city"
                  name="city"
                  value={city}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <SelectOptionInput
                  options={getSelectedStateOptions}
                  selectClass={"select-option"}
                  onSelectChange={handleSelectChange}
                  optionClass={"option-text"}
                  value={state}
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Zipcode</label>
                <input
                  id="zip"
                  type="zip"
                  placeholder="Postcode / zip"
                  name="zip"
                  value={zip}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telephone">Telephone Number</label>
                <input
                  id="telephone"
                  type="telephone"
                  placeholder="Phone"
                  name="telephone"
                  value={telephone}
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  shipping: state.account.shipping,
  loading: state.account.loading,
});

export default connect(mapStateToProps)(withRouter(BillingDetailsForm));
