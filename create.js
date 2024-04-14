function mycreate(obj) {
  function fn() {}
  fn.prototype = obj;
  return fn();
}
