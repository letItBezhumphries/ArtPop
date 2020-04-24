import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import Pagination from "../../UI/Pagination";
import {
  getSelectedArtwork,
  clearSelectedArtwork,
} from "../../../actions/shop";
import Thumbnail from "../../UI/Thumbnail";
import IconList from "../../UI/IconList";
import ArtworkFilter from "./ArtworkFilter";

const FeaturedGallery = ({ images, shop: { loading }, getSelectedArtwork }) => {
  let history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let inventoryArtwork = images.map((image) => (
    <Thumbnail
      key={image._id}
      image={image}
      to={`/shop/artwork/${image._id}`}
      clicked={() => getSelectedArtwork(image._id, history)}
      type="inventory"
      title={image.title}
      imageUrl={image.imageUrl}
      details={image.description}
      price={image.price}
    />
  ));

  const [currentPage, setCurrentPage] = useState(1);
  const [artworkPerPage] = useState(8);
  const indexOfLastArtwork = currentPage * artworkPerPage; //
  const indexOfFirstArtwork = indexOfLastArtwork - artworkPerPage;
  const currentInventory = inventoryArtwork.slice(
    indexOfFirstArtwork,
    indexOfLastArtwork
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className="container-fluid">
            <ArtworkFilter />

            <div className="row row-cols-md-1 row-cols-md-3 u-margin-top-big">
              {currentInventory}
            </div>
          </div>
          <Pagination
            artworkPerPage={artworkPerPage}
            totalArtwork={inventoryArtwork.length}
            paginate={paginate}
            currentPage={currentPage}
          />
          <IconList />
        </Fragment>
      )}
    </Fragment>
  );
};

FeaturedGallery.propTypes = {
  images: PropTypes.array.isRequired,
  shop: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  shop: state.shop,
  images: state.admin.images,
});

export default connect(mapStateToProps, {
  clearSelectedArtwork,
  getSelectedArtwork,
})(FeaturedGallery);
