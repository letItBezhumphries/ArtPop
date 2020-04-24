import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import PriceRangeSlider from "./PriceRangeSlider";
import DropdownMenu from "../../UI/DropdownMenu";
import Spinner from "../../UI/Spinner";

const ArtworkFilter = ({ artwork, loading }) => {
  let itemCount = artwork.length;

  useEffect(() => {
    console.log("artwork :", itemCount);
  }, [itemCount]);

  return loading && !artwork ? (
    <Spinner />
  ) : (
    <div className="filter-toolbar row">
      <DropdownMenu />

      <PriceRangeSlider artwork={artwork} />

      <p className="result-count">
        Showing{" "}
        {itemCount > 24
          ? `24 of ${itemCount} results`
          : `all of ${itemCount} results`}
      </p>
    </div>
  );
};

ArtworkFilter.propTypes = {
  artwork: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  artwork: state.admin.images,
  loading: state.admin.loading,
});

export default connect(mapStateToProps)(ArtworkFilter);
