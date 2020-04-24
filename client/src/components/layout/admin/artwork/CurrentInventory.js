import React from "react";
import { connect } from "react-redux";
import Spinner from "../../../UI/Spinner";

const CurrentInventory = ({ artwork, loading }) => {
  const inventory = artwork.map((art, index) => (
    <div key={index} className="row">
      <div className="col">
        <span className="col-1">
          <span className="col-1">{index}</span>
          <button className="edit">edit</button>
        </span>
        {art.title}
      </div>
    </div>
  ));
  return (
    <div className="current-inventory-container">
      {loading ? <Spinner /> : inventory}
    </div>
  );
};

const mapStateToProps = (state) => ({
  artwork: state.admin.images,
  loading: state.admin.loading,
});

export default connect(mapStateToProps)(CurrentInventory);
