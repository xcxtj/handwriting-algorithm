function debounce(fn, delay) {
  let timer;
  return function () {
    let args = arguments;
    const context = this;
    if (timer) {
      //清除上一次的定时器
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(context, args); //this显式绑定
    }, delay); //定时器会修改this指向 定时器词法环境大多数都是window
  };
}
function iDebounce(func, delay, immediate) {
  let timer;
  return function () {
    const args = arguments;
    const context = this;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate && !timer) {
      func.apply(context, args);
    }
    timer = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args);
      }
      // timer = null;
    }, delay);
  };
}
