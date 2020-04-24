import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DropIcon } from "../../assets/icons/SVG/cheveron-down.svg";
import PropTypes from "prop-types";

const DropdownMenu = (props) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  return (
    <div className="sortBy-dropdown">
      <button
        className="dropbtn"
        onClick={() => setShowSortMenu(!showSortMenu)}
      >
        Sort by popularity
        <DropIcon />
      </button>
      <div id="sortBy" className={showSortMenu ? "show" : "dropdown-content"}>
        <Link
          className="dropdown-item"
          to={{ pathname: "/artwork", search: "?sortBy=popular" }}
        >
          Sort by popularity
        </Link>

        <Link
          className="dropdown-item"
          to={{ pathname: "/artwork", search: "?sortBy=latest" }}
        >
          Sort by latest
        </Link>
        <Link
          className="dropdown-item"
          to={{ pathname: "/artwork", search: "?sortBy=price-low-to-high" }}
        >
          Sort by price: low to high
        </Link>
        <Link
          className="dropdown-item"
          to={{ pathname: "/artwork", search: "?sortBy=price-high-to-low" }}
        >
          Sort by price: high to low
        </Link>
      </div>
    </div>
  );
};

export default DropdownMenu;
