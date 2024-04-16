const flat = (arr,depth=1) => {
  return arr.reduce(
    (pre, cur) => {
		if(Array.isArray(cur)&&depth>0)
		return pre.concat( flat(cur,depth-1) )
		else return pre.concat( cur )},
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