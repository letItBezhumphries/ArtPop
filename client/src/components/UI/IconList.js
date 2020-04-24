import React, { Fragment } from "react";
import { ReactComponent as FacebookIcon } from "../../assets/icons/SVG/facebook.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icons/SVG/twitter.svg";
import { ReactComponent as PinterestIcon } from "../../assets/icons/SVG/pinterest.svg";
import { ReactComponent as InstagramIcon } from "../../assets/icons/SVG/instagram.svg";
import { ReactComponent as PrinterIcon } from "../../assets/icons/SVG/printer.svg";
import { ReactComponent as EnvelopeIcon } from "../../assets/icons/SVG/envelope.svg";

const IconList = ({ location }) => (
  <Fragment>
    {location === "artwork" ? (
      <ul
        className="details-box__media-links-list"
        style={{
          display: "flex",
          justifyContent: "center",
          // padding: "1rem 2.4rem"
        }}
      >
        <li className="details-box__media-list-item">
          <PinterestIcon className="details-box__media-item-icon" />
        </li>
        <li className="details-box__media-list-item">
          <FacebookIcon className="details-box__media-item-icon" />
        </li>
        <li className="details-box__media-list-item">
          <PrinterIcon className="details-box__media-item-icon" />
        </li>
        <li className="details-box__media-list-item">
          <EnvelopeIcon className="details-box__media-item-icon" />
        </li>
      </ul>
    ) : (
      <ul
        className="media-links-list"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem 2.4rem",
          alignSelf: "center",
          marginTop: "4rem",
          marginBottom: "0",
        }}
      >
        <li className="media-links-list__item">
          <FacebookIcon className="media-links-list__icon" />
        </li>
        <li className="media-links-list__item">
          <InstagramIcon className="media-links-list__icon" />
        </li>
        <li className="media-links-list__item">
          <TwitterIcon className="media-links-list__icon" />
        </li>
      </ul>
    )}
  </Fragment>
);

export default IconList;
