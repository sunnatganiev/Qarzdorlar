const formatNum = (num) =>
  Intl.NumberFormat('en-US', {
    useGrouping: true,
    maximumFractionDigits: 0,
    groupingSeparator: ' ',
  }).format(num);

export default formatNum;
