import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { sortArtworkByPriceRange } from "../../../actions/shop";

const PriceRangeSlider = ({ artwork, sortArtworkByPriceRange }) => {
  let sliders, maxPrice, minPrice;

  useEffect(() => {
    sliders = document.querySelectorAll(".price-slider input");
  });

  let prices = artwork.map((item) => {
    return item.price;
  });
  maxPrice = Math.max(...prices);
  minPrice = Math.min(...prices);
  console.log("minPrice:", minPrice, "max:", maxPrice);

  const [maxPriceRange, setMaxPriceRange] = useState(maxPrice);
  const [minPriceRange, setMinPriceRange] = useState(minPrice);

  const updatePriceLabels = (e, slider) => {
    if (slider === "min") {
      handleMinRangeChange(e);
    } else if (slider === "max") {
      handleMaxRangeChange(e);
    }

    if (minPriceRange >= maxPriceRange) {
      setMinPriceRange(maxPriceRange - 3);
      setMaxPriceRange(maxPriceRange);
    }
    if (maxPriceRange <= minPriceRange) {
      setMaxPriceRange(minPriceRange + 3);
      setMinPriceRange(minPriceRange);
    }
  };

  const handleMaxRangeChange = (e) => {
    e.preventDefault();
    setMaxPriceRange(e.target.value);
  };

  const handleMinRangeChange = (e) => {
    e.preventDefault();
    setMinPriceRange(e.target.value);
  };

  return (
    <div className="price-filter-container">
      <form>
        <label
          htmlFor="price"
          className="price-filter-label text-lg-left font-weight-bold"
        >
          Price
        </label>
        <div className="price-slider-wrapper">
          {/* <div className="slidecontainer"> */}
          <div className="price-slider">
            <input
              type="range"
              name="min"
              // className="pricing-range"
              min={minPrice}
              max={maxPrice}
              step="0.5"
              value={minPriceRange}
              className="slider"
              id="min-price"
              onChange={(e) => updatePriceLabels(e, "min")}
            />
            <input
              type="range"
              name="max"
              // className="pricing-range"
              min={minPrice}
              max={maxPrice}
              step="0.5"
              value={maxPriceRange}
              className="slider"
              id="max-price"
              onChange={(e) => updatePriceLabels(e, "max")}
            />
            <button
              className="btn btn-dark btn-filter"
              onClick={() =>
                sortArtworkByPriceRange(minPriceRange, maxPriceRange)
              }
            >
              Filter
            </button>

            <p className="price-label">
              <strong>Price:</strong>
              <span className="min">
                $ {minPriceRange !== minPrice ? minPriceRange : minPrice}
              </span>{" "}
              -{" "}
              <span className="max">
                $ {maxPriceRange !== maxPrice ? maxPriceRange : maxPrice}
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { sortArtworkByPriceRange })(PriceRangeSlider);
