const flat = (arr) => {
  return arr.reduce(
    (pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur) : cur),
    []
  );
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