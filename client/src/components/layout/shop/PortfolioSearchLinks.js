import React, { Fragment } from "react";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import PortfolioLink from "../../UI/PortfolioLink";
import { searchByPortfolio } from "../../../actions/shop";

const PorfolioSearchLinks = ({ portfolios, searchByPortfolio }) => {
  let history = useHistory();

  let portfolioList = portfolios.map(portfolio => (
    <PortfolioLink
      key={portfolio.title}
      to={`/shop/collection/${portfolio.title}`}
      portfolio={portfolio}
      title={portfolio.title}
      image={portfolio.images[0]}
      cardType="portfolioCard"
    />
  ));
  return (
    <Fragment>
      <h2
        className="shop__search-heading"
        style={{ marginTop: "8rem", marginBottom: "2rem" }}
      >
        FEATURED COLLECTIONS
      </h2>
      <div className="portfolioLinks-row">{portfolioList}</div>
    </Fragment>
  );
};

PorfolioSearchLinks.propTypes = {
  portfolios: PropTypes.array.isRequired,
  searchByPortfolio: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  portfolios: state.admin.portfolios
});

export default connect(mapStateToProps, { searchByPortfolio })(
  PorfolioSearchLinks
);
