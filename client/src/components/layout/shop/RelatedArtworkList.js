import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getRelatedArtwork, getSelectedArtwork } from "../../../actions/shop";
import Thumbnail from "../../UI/Thumbnail";
import Spinner from "../../UI/Spinner";
import Pagination from "../../UI/Pagination";

const RelatedArtworkList = ({ getSelectedArtwork, loading, related }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [artworkPerPage, setArtworkPerPage] = useState(4);

  useEffect(() => {
    console.log(
      "in [RelatedArtworkList.jsx] useEffect => artworkPerPage:",
      artworkPerPage,
      "related:",
      related
    );
  }, [related]);

  let relatedArtwork = related.map((image) => (
    <li
      key={image._id}
      style={{
        listStyle: "none",
        padding: "0 0",
        margin: "0 0",
        width: "25rem",
      }}
      className="related-artwork__listitem card border-white"
    >
      <Thumbnail
        image={image}
        to={`/shop/artwork/${image._id}`}
        clicked={() => getSelectedArtwork(image._id)}
        type="related"
        classes="related-artwork__item"
      />
    </li>
  ));

  const indexOfLastArtwork = currentPage * artworkPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworkPerPage;
  const currentArtwork = relatedArtwork.slice(
    indexOfFirstArtwork,
    indexOfLastArtwork
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return loading || related === undefined ? (
    <Spinner />
  ) : (
    <Fragment>
      <h4
        className="shop__search-heading"
        style={{ marginTop: "1.5rem", marginBottom: "3.4rem" }}
      >
        Other Artwork Available
      </h4>
      <ul
        className={`related-artwork__list row row-cols-${artworkPerPage} border-white`}
      >
        {currentArtwork}
      </ul>
      <Pagination
        artworkPerPage={artworkPerPage}
        totalArtwork={relatedArtwork.length}
        paginate={paginate}
      />
    </Fragment>
  );
};

RelatedArtworkList.propTypes = {
  loading: PropTypes.bool.isRequired,
  related: PropTypes.array.isRequired,
  getSelectedArtwork: PropTypes.func.isRequired,
  getRelatedArtwork: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.shop.loading,
  related: state.shop.related,
});

export default connect(mapStateToProps, {
  getRelatedArtwork,
  getSelectedArtwork,
})(RelatedArtworkList);
