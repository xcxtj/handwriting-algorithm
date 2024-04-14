function myreduce(fn, pre) {
  for (let i = 0; i < this.length; i++) {
    if (typeof pre === "undefined") {
      pre = fn(this[i], this[i + 1], i + 1, this);
      i++;
    } else pre = fn(pre, this[i], i, this);
  }
  return pre;
}

const arr = [1, 2, 3, 4, 5];
const sum = myreduce.call(arr, (acc, curr) => acc + curr);
console.log(sum); // Output: 15

const product = myreduce.call(arr, (acc, curr) => acc * curr, 1);
console.log(product); // Output: 120
