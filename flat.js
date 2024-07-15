const flat = (arr, depth = 1) => {
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur) && depth > 0)
      return pre.concat(flat(cur, depth - 1));
    else return pre.concat(cur);
  }, []);
};
let arr = [
  1,
  2,
  3,
  4,
  [1, 2, 3, [1, 2, 3, [1, 2, 3]]],
  5,
  "string",
  { name: "弹铁蛋同学" },
];
console.log(flat(arr));
let input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
};
// console.log(flat(input));

// const flat = (input, depth = 1) => {
//   const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);

//   const flatten = (item, currentDepth) => {
//     if (Array.isArray(item) && currentDepth > 0) {
//       return item.reduce((acc, cur) => acc.concat(flatten(cur, currentDepth - 1)), []);
//     } else if (isObject(item) && currentDepth > 0) {
//       return Object.keys(item).reduce((acc, key) => {
//         const value = flatten(item[key], currentDepth - 1);
//         if (isObject(value) && Object.keys(value).length === 0) {
//           return acc;
//         }
//         return { ...acc, [key]: value };
//       }, {});
//     } else {
//       return item;
//     }
//   };

//   return flatten(input, depth);
// };