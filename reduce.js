function myreduce(fn, pre) {
	//fn（reducer函数）和pre（初始值）
  for (let i = 0; i < this.length; i++) {
    if (typeof pre === "undefined"&& i === 0) {
		// 如果没有提供初始值，则使用数组的第一个元素作为初始值
      pre = this[i];
    } else pre = fn(pre, this[i], i, this);
  }
  return pre;
}

const arr = [1, 2, 3, 4, 5];
const sum = myreduce.call(arr, (acc, curr) => acc + curr);
console.log(sum); // Output: 15

const product = myreduce.call(arr, (acc, curr) => acc * curr, 1);
console.log(product); // Output: 120
