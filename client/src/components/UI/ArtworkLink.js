import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import setImageSize from "../../utils/setImageSize";
import ArtworkLinkText from "./ArtworkLinkText";

const ArtworkLink = ({ to, artwork, clicked, linkType, classes }) => {
  const imgRef = useRef(null);
  const { imageUrl, width, height } = artwork;

  let imgStyles = setImageSize(height, width);

  useEffect(() => {
    console.log(
      "in [ArtworkLink.jsx] => artwork:",
      artwork,
      "linkType:",
      linkType,
      "imgStyles:",
      imgStyles
    );
    // imgRef.current.addEventListener("load", setImageDimension);
  }, []);

  return (
    <Link
      to={to}
      onClick={clicked}
      style={{
        textDecoration: "none",
        width: "100%",
        // height: "100%",
        // backgroundColor: "orangered",
        // alignSelf: "start",
        // display: "flex",
        // flexDirection: "row",
        // justifyContent: "space-evenly"
      }}
      className={
        linkType === "dropdown"
          ? "navbar__dropdown-item-link"
          : "thumbnail " + linkType
      }
    >
      <div
        className={
          linkType === "dropdown"
            ? "navbar__dropdown-item"
            : "thumbnail " + linkType
        }
        style={
          {
            // backgroundColor: "yellow",
            // width: "100%",
            // maxHeight: "4rem",
            // padding: "0 .5rem",
            // margin: "0 0",
            // display: "flex",
            // flexDirection: "row",
            // justifyContent: "space-evenly"
          }
        }
      >
        <img
          ref={imgRef}
          style={imgStyles}
          src={imageUrl}
          className={
            linkType === "dropdown" || linkType === "cartItem"
              ? "navbar__dropdown-item-img"
              : "thumbnail__img card-img-top"
          }
        />

        <ArtworkLinkText artwork={artwork} linkType={linkType} />
      </div>
    </Link>
  );
};

export default ArtworkLink;
