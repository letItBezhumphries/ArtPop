import React from "react";
import { Link } from 'react-router-dom';

const Button = props => (
  <Link to={props.to}>
    <button className={props.class} onClick={props.clicked} type="button">
      {props.children}
    </button>
  </Link>
);

export default Button;
