import React, { Fragment } from 'react';

const RangeSlider = props => {
  return (
    <Fragment>
      <div class="slidecontainer">
        <input type="range" min="1" max="100" value="50" class="slider" id="myRange" />
      </div>
    </Fragment>
  )
}

export default RangeSlider;
