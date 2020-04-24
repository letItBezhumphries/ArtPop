import React, { Fragment } from "react";
import transformNumToFormattedString from "../../../utils/transformNumToFormattedString";

const CheckoutSummaryItem = ({ item }) => {
  return (
    <Fragment>
      <tr>
        <td className="item-col-1">
          {item.item.title}, {item.item.year} x {item.quantity || 1}
        </td>
        <td className="item-col-2">
          ${transformNumToFormattedString(item.item.price)}
        </td>
      </tr>
    </Fragment>
  );
};

export default CheckoutSummaryItem;
