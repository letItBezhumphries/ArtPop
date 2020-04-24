import React from "react";

const ExhibitionItem = ({ exhibit }) => {
  return (
    <div className="exhibitions-page__item card border-light mb-3">
      <div className="row no-gutters">
        <div className="col-md-4">
          <img
            src={exhibit.image}
            alt="Photo of Artwork"
            className="exhibitions-page__img card-img"
          />
        </div>
        <div className="col-md-8">
          <div className="exhibitions-page__exhibit-details card-body">
            <h5 className="exhibitions-page__title card-title">
              Todd J. Clark
            </h5>
            <p className="exhibitions-page__subTitle card-text">
              {exhibit.subTitle}
            </p>
            <p className="exhibitions-page__location card-text">
              {exhibit.location}
            </p>
            <p className="exhibitions-page__start-date card-text">
              {exhibit.startDate.split(",")[0] +
                "-" +
                exhibit.endDate.split(",")[0] +
                " |" +
                exhibit.endDate.split(",")[1]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionItem;
