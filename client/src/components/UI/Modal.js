import React, { useEffect, useState } from "react";
import Aux from '../hoc/Aux';

const Modal = ({ show, classes, Component, ...children}) => { 
  useEffect(() => {

  }, []);


  return (
    <Aux>
      {/* need to pass a click handler to close the modal or move to next step or backdrop */}
      <div className={"modal" + "__" + classes}>
        <Component
          className={classes}
          style={{
            transform: show ? "translateY(0)" : "translateY(-100vh)",
            opacity: show ? "1" : "0"
          }}
        >
          {children}
        </Component>
      </div>
    </Aux>
  );
}

export default Modal;
