import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, useHistory, withRouter } from "react-router-dom";
import { ReactComponent as ShoppingCartIcon } from "../../assets/icons/SVG/add_shopping_cart.svg";
import { ReactComponent as CartListIcon } from "../../assets/icons/SVG/shopping-cart1.svg";
import DropdownItem from "./DropdownItem";
import { loadCart } from "../../actions/cart";
import transformNumToFormattedString from "../../utils/transformNumToFormattedString";

const Dropdown = ({ cart, auth: { isAuthenticated }, loadCart }) => {
  const { itemsCount, items, total } = cart;
  const [showCartItemsCount, setShowCartItemsCount] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }

    if (itemsCount > 0) {
      setShowCartItemsCount(!showCartItemsCount);
    } else {
      setShowCartItemsCount(showCartItemsCount);
    }
  }, [itemsCount]);

  let cartItems = items.map((item) => (
    <DropdownItem key={item.itemId._id} item={item.itemId} />
  ));

  const emptyCartList = (
    <p
      className="navbar__dropdown-cart-item dropdown-cart-item--empty"
      style={{ borderBottom: "1px solid black" }}
    >
      NO PRODUCTS IN THE CART.
    </p>
  );

  return (
    <div className="navbar__dropdown">
      <Link to="/shop/my-cart" className="navbar__link navbar__dropbtn">
        <ShoppingCartIcon className="navbar__icon dropdown cart-icon" />
        <span
          className="navbar__cart-badge"
          style={
            showCartItemsCount ? { display: "block" } : { display: "none" }
          }
        >
          {itemsCount}
        </span>
      </Link>

      <div className="navbar__dropdown-container">
        <ul className="navbar__dropdown-cart-list">
          {items.length > 0 ? cartItems : emptyCartList}
          <li className="navbar__dropdown-cart-item dropdown-cart-item--header">
            <Link
              to="/shop/my-cart"
              className="button button-white navbar__dropdown-cart-btn"
            >
              CART
              <CartListIcon className="navbar__dropdown-cart-icon" />
            </Link>
            <span className="navbar__dropdown-cart-total">
              TOTAL: <span>$ {transformNumToFormattedString(total)}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  cart: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  loadCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  auth: state.auth,
});

export default connect(mapStateToProps, { loadCart })(withRouter(Dropdown));
