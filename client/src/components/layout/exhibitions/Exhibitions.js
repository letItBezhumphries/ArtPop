import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../../UI/Spinner";
import ExhibitionList from "./ExhibitionList";
// import from "../../../styles/uploads/soloTodd.jpg";

const Exhibitions = ({ exhibitions }) => {
  useEffect(() => {
    // console.log("exhibitions :", exhibitions);
  }, [exhibitions]);

  const { loading, exhibits } = exhibitions;
  return (
    <section className="exhibitions-page fade-in">
      <h1 className="exhibitions-page__header">Exhibitions</h1>

      {loading && exhibits === null ? <Spinner /> : <ExhibitionList />}
    </section>
  );
};

Exhibitions.propTypes = {
  exhibitions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  exhibitions: state.exhibitions,
});

export default connect(mapStateToProps)(Exhibitions);
