import React from "react";
import { ReactComponent as IconLeft } from "../../assets/icons/SVG/chevron-thin-left.svg";
import { ReactComponent as IconRight } from "../../assets/icons/SVG/chevron-thin-right.svg";

const ImageSlide = ({ image, prev, next, curIdx }) => {
  const { imageUrl, portfolio } = image;
  const portfolioTitle = portfolio.split("_").join(" ");
  const styles = { backgroundImage: `url(${imageUrl})` };

  return (
    <div className="bg-carousel__img-slide" style={styles}>
      <div className="iconbox--left" onClick={() => prev(curIdx)}>
        <IconLeft className="icon--left" />
      </div>
      <div className="iconbox--right" onClick={() => next(curIdx)}>
        <IconRight className="icon--right" />
      </div>

      <div className="img-details">
        <span className="img-details__header">Portfolio / </span>
        <span className="img-details__portfolio-title">{portfolioTitle}</span>
      </div>
    </div>
  );
};

export default ImageSlide;
