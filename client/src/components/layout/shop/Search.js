import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Spinner from "../../UI/Spinner";
import { searchByTitle } from "../../../actions/shop";
import { ReactComponent as SearchIcon } from "../../../assets/icons/SVG/search.svg";

const Search = ({ shop: { loading, search }, searchByTitle }) => {
  let history = useHistory();
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    console.log("[Search.jsx] useEffect searchTitle:", searchTitle);
  }, [searchTitle, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await searchByTitle(searchTitle, history);
    setSearchTitle("");
  };

  return (
    <div className="shop__search-box">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h2 className="shop__search-heading">Search the Inventory:</h2>
          <form className="shop__search" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              className="shop__search search__input"
              placeholder="Search inventory"
              id="title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <button className="shop__search search__button">
              <SearchIcon className="shop__search search__icon" />
            </button>
          </form>
        </Fragment>
      )}
    </div>
  );
};

Search.propTypes = {
  searchByTitle: PropTypes.func.isRequired,
  shop: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  shop: state.shop,
});

export default connect(mapStateToProps, { searchByTitle })(Search);
