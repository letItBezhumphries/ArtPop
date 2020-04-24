

const setCardTypeStyle = cardType => {
  let styles;
  switch (cardType) {
    case cardType === "related":
      styles = {
        width: "25%",
        height: "auto",
        textDecoration: "none",
        listStyle: "none"
      };
      break;
    case cardType === "dropdown":
      styles = {
        width: "60%",
        height: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      };
      break;
    case cardType === "inventory":
      styles = { width: "65%", height: "auto" };
      break;
    default:
      styles = { width: "30rem", height: "auto" };
  }
  return styles;
};

export default setCardTypeStyle;