function throttle(func, delay) {
  let lasttime = Date.now();
  return function () {
    let curtime = Date.now();
    if (curtime - lasttime > delay) {
      func.apply(this, arguments);
      lasttime = Date.now();
    }
  };
}
