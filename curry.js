function curry(fn, ...args) {
  return function _curry(..._args) {
    _args = [...args, ..._args]; //合并成一个新的参数数组
    if (_args.length >= fn.length) {
      // 判断接受的参数是否大于函数的参数长度
      return fn(..._args);
    } else return curry(fn, ..._args);// 参数不够长度，再次接受传递参数
  };
}
function sum(a, b, c) {
  return a + b + c;
}
const add1 = curry(sum);
console.log(add1(1, 2)(3));
