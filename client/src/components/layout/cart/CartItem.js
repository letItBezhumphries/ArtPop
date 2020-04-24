import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Link, useHistory } from "react-router-dom";
import { removeFromCart } from "../../../actions/cart";
import { getSelectedArtwork } from "../../../actions/shop";
import PropTypes from "prop-types";
import Spinner from "../../UI/Spinner";
import transformNumToFormattedString from "../../../utils/transformNumToFormattedString";

const CartItem = ({ loading, item, removeFromCart, getSelectedArtwork }) => {
  let history = useHistory();
  const { _id, imageUrl, title, price, year, width, height } = item.itemId;
  useEffect(() => {
    console.log(
      "in [CartItem.jsx] item:",
      _id,
      imageUrl,
      title,
      price,
      year,
      width
    );
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <tr className="item">
          <td
            className="item-remove"
            style={{
              width: "1.4rem",
              height: "auto",
              borderRight: "1px solid #e0dede",
            }}
          >
            <button
              className="btn-remove"
              type="button"
              onClick={() => removeFromCart(item.itemId._id)}
            >
              x
            </button>
          </td>
          <td className="item-image" style={{ padding: ".5rem 1rem" }}>
            <Link
              to={`/shop/artwork/${item.itemId._id}`}
              style={{ textDecoration: "none" }}
              onClick={() => getSelectedArtwork(item.itemId._id, history)}
            >
              <img
                className="item-image__thumbnail"
                src={item.itemId.imageUrl}
                style={{ width: "10rem", height: "auto" }}
                // style={ width > 750 ? { display: "block", width: "100%", height: "auto" } : { display: "block", width: "60%", height: "auto" }}
              />
            </Link>
          </td>
          <td className="item-name">
            <Link
              to={`/shop/artwork/${item.itemId._id}`}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "2rem",
                fontFamily: "Cormorant Garamond",
              }}
              onClick={() => getSelectedArtwork(item.itemId._id, history)}
            >
              {item.itemId.title}, {item.itemId.year}
            </Link>
          </td>
          <td className="item-price">
            $ {transformNumToFormattedString(item.itemId.price)}
          </td>
          <td className="item-quantity" style={{ paddingLeft: "4rem" }}>
            {item.quantity}
          </td>
          <td className="item-subtotal">
            $ {transformNumToFormattedString(item.itemId.price * item.quantity)}
          </td>
        </tr>
      )}
    </Fragment>
  );
};

CartItem.propTypes = {
  removeFromCart: PropTypes.func.isRequired,
  getSelectedArtwork: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  // added: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.cart.loading,
  added: state.cart.added,
});

export default connect(mapStateToProps, { removeFromCart, getSelectedArtwork })(
  withRouter(CartItem)
);
