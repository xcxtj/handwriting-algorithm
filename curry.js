function curry(fn) {
  let length = fn.length;
  return function _curry(...args) {
    if (args.length < length) { // 判断接受的参数是否小于函数的参数长度
      return function () {// 参数不够长度，再次接受传递参数
        return _curry(...args, ...arguments);
      };
    } else return fn(...args);// 不要求改变this,
  };
}
function sum(a, b, c) {
  return a + b + c;
}
const add1 = curry(sum);
console.log(add1(1, 2)(3));
