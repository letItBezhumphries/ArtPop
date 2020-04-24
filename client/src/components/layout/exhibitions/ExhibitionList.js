import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../../UI/Spinner";
import ExhibitionItem from "./ExhibitionItem";

const ExhibitionList = ({ exhibitions }) => {
  useEffect(() => {
    console.log("exhibitions :", exhibitions);
    window.scrollTo(0, 0);
  }, [exhibitions]);

  const { loading, exhibits } = exhibitions;

  let exhibitionList;
  if (exhibits !== null) {
    exhibitionList = exhibits.map((exhibit, index) => {
      return <ExhibitionItem key={index} exhibit={exhibit} />;
    });
  }

  return loading && exhibits === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <div className="exhibitions-page__list">{exhibitionList}</div>
    </Fragment>
  );
};

ExhibitionList.propTypes = {
  exhibitions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  exhibitions: state.exhibitions,
});

export default connect(mapStateToProps)(ExhibitionList);
