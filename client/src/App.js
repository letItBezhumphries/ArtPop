import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import Footer from "./components/navigation/Footer";
import Landing from "./components/layout/Landing";
import Routes from "./components/routing/Routes";
import { loadUser } from "./actions/auth";
import { loadAccount } from "./actions/account";
import { loadCart } from "./actions/cart";
import { loadShop } from "./actions/admin";
import setAuthToken from "./utils/setAuthToken";

//Redux
import { Provider } from "react-redux";
import store from "./store";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadShop());
    store.dispatch(loadAccount());
    store.dispatch(loadCart());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
          <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
