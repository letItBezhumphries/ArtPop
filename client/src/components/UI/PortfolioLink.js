import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { searchByPortfolio } from '../../actions/shop';

const PortfolioLink = ({ to, searchByPortfolio, ...props }) => {
  const { cardType } = props;
  const portfolioTitle = props.title.split("_").join(" ");
  

  const dimension = cardType === "portfolioCard" ? '25rem': '16.95rem';

  return (
    <div
      className="PortfolioLink"
      onClick={() => searchByPortfolio(props.title)}
    >
      <Link
        to={to}
        className="PortfolioLink__link"
        style={{
          textDecoration: "none",
        }}
      >
        <img
          style={{ height: dimension, width: dimension, zIndex: "inherit" }}
          src={props.image.imageUrl}
          alt={`Photo ${portfolioTitle}`}
          className={"PortfolioLink__" + cardType + "-img"}
        />
        <span
          className={"PortfolioLink__" + cardType + "-txt"}
          style={{ zIndex: "inherit" + 1 }}
        >
          {portfolioTitle}
        </span>
      </Link>
    </div>
  );
}

PortfolioLink.propTypes = {
  searchByPortfolio: PropTypes.func.isRequired,
}

export default connect(null, {searchByPortfolio})(PortfolioLink);
