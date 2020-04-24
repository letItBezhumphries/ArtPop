import React, { Fragment } from "react";
import transformNumToFormattedString from "../../utils/transformNumToFormattedString";

const ArtworkLinkText = ({ artwork, linkType }) => {
  const { title, year, price, inStock } = artwork;

  return (
    <div
      className={
        "navbar__" + linkType + "-item-details u-margin-top-small card-body"
      }
    >
      {linkType === "related" ? (
        <Fragment>
          <h6 className={linkType + "__img-title card-title"}>
            Todd Clark - {title}, {year}
            {!inStock && (
              <span className={linkType + "__img-out-of-stock-flag"}></span>
            )}
          </h6>
          <span className={linkType + "__img-price card-text"}>
            $ {transformNumToFormattedString(price)}
          </span>
        </Fragment>
      ) : (
        <Fragment>
          {linkType === "dropdown" && (
            <Fragment>
              <p className={"navbar__" + linkType + "-item-title card-title"}>
                {title}, {year}
              </p>
              <p className={"navbar__" + linkType + "-item-price card-text"}>
                <span
                  className={"navbar__" + linkType + "-item-quantity card-text"}
                >
                  1 X{" "}
                </span>
                $ {transformNumToFormattedString(price)}
              </p>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ArtworkLinkText;
