function mynew(fn) {
  let obj = {};
  obj.__proto__ = fn.prototype;
  let res = fn.call(obj, arguments);
  return res instanceof Object ? res : obj;
}
