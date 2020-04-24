import React, { useEffect } from "react";
import { ReactComponent as NextIcon } from "../../assets/icons/SVG/chevron-thin-right.svg";
import { ReactComponent as PrevIcon } from "../../assets/icons/SVG/chevron-thin-left.svg";

import PaginationLink from "./PaginationLink";

const Pagination = ({
  artworkPerPage,
  totalArtwork,
  paginate,
  currentPage,
}) => {
  useEffect(() => {
    console.log("in [Pagination.jsx], currentPage:", currentPage);
  }, [currentPage]);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalArtwork / artworkPerPage); i++) {
    pageNumbers.push(i);
  }

  const prevPage = (currentPage) => {
    let prev = currentPage - 1;
    paginate(prev);
  };

  const nextPage = (currentPage) => {
    let next = currentPage + 1;
    paginate(next);
  };

  return (
    <nav className="pagination-ctrls-container">
      <ul className="pagination pagination-lg">
        {currentPage > 1 ? (
          <li className="page-item page-ctrl-item">
            <button
              className="page-link page-link-prev"
              onClick={() => prevPage(currentPage)}
            >
              <PrevIcon className="page-link-prev__icon" />
            </button>
          </li>
        ) : null}
        {pageNumbers.map((number) => (
          <PaginationLink
            key={number}
            clicked={() => paginate(number)}
            number={number}
            current={currentPage}
            active={number === currentPage ? true : false}
          />
        ))}
        {currentPage < pageNumbers[pageNumbers.length - 1] ? (
          <li className="page-item page-ctrl-item">
            <button
              className="page-link page-link-next"
              style={{ textDecoration: "none" }}
              onClick={() => nextPage(currentPage)}
            >
              <NextIcon
                // onClick={() => nextPage(currentPage)}
                className="page-link-next__icon"
              />
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default Pagination;
