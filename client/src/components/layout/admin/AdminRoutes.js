import React from "react";
import { Switch } from "react-router-dom";
import AdminRoute from "../../routing/AdminRoute";
import Artwork from "./artwork/Artwork";
import AddCollectionsPage from "./collections/AddCollectionsPage";
import AddCouponsPage from "./coupons/AddCouponsPage";
import AddExhibitionPage from "./exhibitions/AddExhibitionPage";

const AdminRoutes = () => {
  return (
    <div className="admin-dashboard">
      <Switch>
        <AdminRoute
          exact
          path="/admin/collections"
          component={AddCollectionsPage}
        />
        <AdminRoute exact path="/admin/artwork" component={Artwork} />
        <AdminRoute exact path="/admin/coupons" component={AddCouponsPage} />
        <AdminRoute
          exact
          path="/admin/exhibitions"
          component={AddExhibitionPage}
        />
      </Switch>
    </div>
  );
};

export default AdminRoutes;
