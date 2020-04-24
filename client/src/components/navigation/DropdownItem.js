import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { getSelectedArtwork } from "../../actions/shop";
import ArtworkLink from "../UI/ArtworkLink";
// import Thumbnail from "../UI/Thumbnail";

const DropdownItem = ({ item, getSelectedArtwork }) => {
  let history = useHistory();
  const { _id } = item;
  console.log(
    "inside DROPDOWNITEM, item:",
    item,
    "to:",
    `/shop/artwork/${_id}`
  );

  return (
    <Fragment>
      <li
        item={item}
        className="navbar__dropdown-cart-listItem"
        style={{ listStyle: "none", maxWidth: "100%" }}
      >
        <ArtworkLink
          artwork={item}
          clicked={() => getSelectedArtwork(item._id, history)}
          to={`/shop/artwork/${_id}`}
          linkType="dropdown"
          style={{ borderBottom: "2px solid black" }}
          classes="navbar__dropdown-cart-item"
        />
      </li>
    </Fragment>
  );
};

DropdownItem.propTypes = {
  cart: PropTypes.object.isRequired,
  getSelectedArtwork: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { getSelectedArtwork })(
  withRouter(DropdownItem)
);
