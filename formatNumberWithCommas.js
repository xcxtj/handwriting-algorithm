function formatNumberWithCommas(num) {
  num += "";
  let [integer, decimal] = num.split(".");
  const dosplit = (str='', isint = true) => {
    if (str === '') return "";
    if (isint) str = str.split("").reverse();
    let res = [];
    for (let i = 0; i < str.length; i++) {
      if (i % 3 === 0 && i !== 0) {
        res.push(",");
      }
      res.push(str[i]);
    }
    if(isint) res = res.reverse();
    return res.join("");
  };
  integer= dosplit(integer)
  decimal = dosplit(decimal, false);
  return decimal==='' ? integer+'.'+decimal : integer;
}
let num = 1234567890;
console.log(formatNumberWithCommas(num)); // 1,234,567,890.123456