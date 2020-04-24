import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Logo = props => (
  <Fragment>
    <Link to="/" className="navbar__logo" style={{ textDecoration: "none" }}>
      <span className="name-first">Todd</span>
      <span className="name-last">Clark</span>
    </Link>
  </Fragment>
);

export default Logo;
