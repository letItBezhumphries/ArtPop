
const transformNumToFormattedString = num => {
  let amount = parseFloat(num).toFixed(2);
  const formattedString = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedString;
};

export default transformNumToFormattedString;