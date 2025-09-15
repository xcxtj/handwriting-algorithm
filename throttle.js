function throttle(func, delay) {
  let lasttime = Date.now();
  return function () {
    let arg = [...arguments];
    let curtime = Date.now();
    if (curtime - lasttime > delay) {
      const context = this;
      //点击第二次的时候判断时间有没有到
      func.apply(context, arg);
      lasttime = Date.now();
    }
  };
}
