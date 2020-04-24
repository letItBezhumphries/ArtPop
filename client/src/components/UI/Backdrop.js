import React, { Fragment, useState, useEffect } from 'react';

const Backdrop = (props) => (
  props.show ? (<div className={props.classes} onClick={props.clicked}></div>) : null
);

export default Backdrop;
