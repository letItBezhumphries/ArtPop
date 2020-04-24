import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import FeaturedGallery from "./FeaturedGallery";
import CollectionGallery from "./CollectionGallery";
import ArtworkView from "./ArtworkView";
import Search from "./Search";
import PortfolioSearchLinks from "./PortfolioSearchLinks";
import Cart from "../cart/Cart";
import Checkout from "../checkout/Checkout";
import {
  getSelectedArtwork,
  clearSelectedArtwork,
} from "../../../actions/shop";
import Spinner from "../../UI/Spinner";
import PrivateRoute from "../../routing/PrivateRoute";

const Shop = ({ shop: { loading, image, search } }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    clearSelectedArtwork();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <section className="shop">
          <h1 className="shop__heading">
            <span>Inventory</span>
          </h1>

          {image === null && search.length === 0 && (
            <Fragment>
              <Search />
              <PortfolioSearchLinks />
            </Fragment>
          )}

          <Switch>
            <PrivateRoute exact path="/checkout" component={Checkout} />
            <Route path={"/shop/artwork/:id"} component={ArtworkView} />
            <Route
              path={"/shop/collection/:title"}
              component={CollectionGallery}
            />
            <Route path="/shop/my-cart" component={Cart} />
            <Route exact path="/shop/inventory" component={FeaturedGallery} />
          </Switch>
        </section>
      )}
    </Fragment>
  );
};

Shop.propTypes = {
  shop: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  clearSelectedArtwork: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  shop: state.shop,
  images: state.admin.images,
});

export default connect(mapStateToProps, {
  getSelectedArtwork,
  clearSelectedArtwork,
})(Shop);
