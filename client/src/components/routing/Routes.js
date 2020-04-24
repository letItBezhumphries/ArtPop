import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Alert from "../UI/Alert";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Story from "../layout/story/Story";
import Shop from "../layout/shop/Shop";
import CollectionGallery from "../layout/shop/CollectionGallery";
import Exhibitions from "../layout/exhibitions/Exhibitions";
import Cart from "../layout/cart/Cart";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Checkout from "../layout/checkout/Checkout";
import AdminDashboard from "../layout/admin/AdminDashboard";
import Artwork from "../layout/admin/artwork/Artwork";
import AddCollectionsPage from "../layout/admin/collections/AddCollectionsPage";
import AddCouponsPage from "../layout/admin/coupons/AddCouponsPage";
import AddExhibitionPage from "../layout/admin/exhibitions/AddExhibitionPage";
import Orders from "../layout/admin/orders/Orders";
import ArtworkView from "../layout/shop/ArtworkView";
import PaymentSuccess from "../layout/checkout/PaymentSuccess";

const Routes = () => {
  let history = useHistory();
  return (
    <div className="container-main">
      <Alert />
      <Switch>
        <AdminRoute exact path="/admin/artwork" component={Artwork} />
        <AdminRoute
          exact
          path="/admin/collections"
          component={AddCollectionsPage}
        />
        <AdminRoute
          exact
          path="/admin/exhibitions"
          component={AddExhibitionPage}
        />
        <AdminRoute exact path="/admin/coupons" component={AddCouponsPage} />
        <AdminRoute exact path="/admin/orders" component={Orders} />
        <AdminRoute exact path="/admin" component={AdminDashboard} />
        <PrivateRoute exact path="/checkout" component={Checkout} />
        <PrivateRoute
          exact
          path="/payment-success"
          component={PaymentSuccess}
        />
        <Route exact path="/story" component={Story} />
        <Route exact path="/shop/inventory" component={Shop} />
        <Route exact path="/shop/artwork/:id" component={ArtworkView} />
        <Route
          exact
          path="/shop/collection/:title"
          component={CollectionGallery}
        />
        <Route exact path="/exhibitions" component={Exhibitions} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/shop/my-cart" component={Cart} />
      </Switch>
    </div>
  );
};

export default Routes;
