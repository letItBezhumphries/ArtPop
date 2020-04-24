import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CheckoutSummaryItem from "./CheckoutSummaryItem";
import CartSummary from "../cart/CartSummary";
import Spinner from "../../UI/Spinner";

const CheckoutSummary = ({ order }) => {
  const { items, loading } = order;

  useEffect(() => {}, [items]);

  return (
    <Fragment>
      {loading || order === null ? (
        <Spinner />
      ) : (
        <div className="checkout__summary">
          <h3 className="checkout__header lead">YOUR ORDER</h3>
          <table className="checkout__table" cellSpacing="0">
            <thead>
              <tr>
                <th className="product-name-col-1">PRODUCT</th>
                <th className="item-col-2">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, index) => {
                return (
                  <CheckoutSummaryItem
                    key={i.item._id + index}
                    item={i}
                    quantity={i.quantity}
                  />
                );
              })}
            </tbody>
            <tfoot>
              <CartSummary />
            </tfoot>
          </table>
        </div>
      )}
    </Fragment>
  );
};

CheckoutSummary.propTypes = {
  order: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  order: state.order,
});

export default connect(mapStateToProps)(CheckoutSummary);
