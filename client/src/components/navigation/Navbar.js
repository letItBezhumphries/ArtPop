import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Logo from "./Logo";
import { logout } from "../../actions/auth";
import { clearSelectedArtwork } from "../../actions/shop";
import { loadCart } from "../../actions/cart";
import Dropdown from "./Dropdown";

const Navbar = ({
  auth: { isAuthenticated, isAdmin, loading },
  logout,
  clearSelectedArtwork,
  cart
}) => {
  const { itemsCount } = cart;
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

  const adminLinks = (
    <div className="navbar__links">
      <Link to="/admin/bio" className="navbar__link">
        bio
      </Link>
      <Link to="/exhibitions" className="navbar__link">
        exhibitions
      </Link>
      <Link to="/admin/shop" className="navbar__link">
        shop
      </Link>
      <Link to="/admin/upload" className="navbar__link">
        artwork
      </Link>
      <Link to="/logout" className="navbar__link" onClick={logout}>
        logout
      </Link>
    </div>
  );

  const shopAuthLinks = (
    <div className="navbar__links">
      <Link to="/story" className="navbar__link">
        about
      </Link>
      <Link to="/exhibitions" className="navbar__link">
        exhibitions
      </Link>
      <Link
        to="/shop/inventory"
        className="navbar__link"
        onClick={clearSelectedArtwork}
      >
        inventory
      </Link>
      <Link to="/shop/my-account" className="navbar__link">
        account
      </Link>
      <Link to="/" className="navbar__link" onClick={logout}>
        logout
      </Link>
      <Dropdown />
    </div>
  );

  const unAuthorizedLinks = (
    <div className="navbar__links">
      <Link to="/story" className="navbar__link">
        about
      </Link>
      {/* <DropdownList /> */}
      <Link to="/exhibitions" className="navbar__link">
        exhibitions
      </Link>
      <Link
        to="/shop/inventory"
        className="navbar__link"
        onClick={clearSelectedArtwork}
      >
        inventory
      </Link>
      <Link to="/login" className="navbar__link">
        login
      </Link>
      <Link to="/register" className="navbar__link">
        sign up
      </Link>
      <Dropdown />
      {/* <div className="navbar__dropdown">
        <Link to="/shop/my-cart" className="navbar__link">
          <Icon iconType="icon-add_shopping_cart" class="navbar__icon">
            <span className="navbar__cart-items-span" show={showCartItemsCount}>
              {total}
            </span>
          </Icon>
        </Link>
      </div> */}
      {/* <Link to="/shop/my-cart" className="navbar__link">
        <Icon iconType="icon-add_shopping_cart" class="navbar__icon">
          <span className="navbar__cart-items-span" show={showCartItemsCount}>
            {total}
          </span>
        </Icon>
      </Link> */}
    </div>
  );

  return (
    <nav className="navbar">
      <Logo />
      {!loading && isAdmin ? (
        <Fragment>{adminLinks}</Fragment>
      ) : !loading && isAuthenticated ? (
        <Fragment>{shopAuthLinks}</Fragment>
      ) : (
        <Fragment>{unAuthorizedLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  clearSelectedArtwork: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  cart: state.cart
});

export default connect(mapStateToProps, { logout, clearSelectedArtwork })(
  Navbar
);
