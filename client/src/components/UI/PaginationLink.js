import React, { Fragment } from "react";

const PaginationLink = ({ current, clicked, number }) => {
  return (
    <Fragment>
      <li
        className={
          current === number
            ? "page-item page-ctrl-item--active"
            : "page-item page-ctrl-item"
        }
      >
        <a
          onClick={clicked}
          className={
            current === number
              ? "page-link page-ctrl-link--active"
              : "page-link page-ctrl-link"
          }
        >
          {number}
        </a>
      </li>
    </Fragment>
  );
};

export default PaginationLink;
