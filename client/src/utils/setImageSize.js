const setImageSize = (height, width) => {
  let styles;
  let disparity = height - width;
  if (disparity <= -100) {
    styles = { height: "auto", width: "100%", display: "block" };
  } else if (disparity > -100) {
    styles = { height: "50%", width: "60%", display: "block" };
  } else if (disparity <= -150) {
    styles = { height: "auto", width: "100%", display: "block" };
  } else {
    styles = { height: "100%", width: "45%", display: "block" };
  }
  return styles;
};

export default setImageSize;
