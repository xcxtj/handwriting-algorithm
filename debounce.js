function debounce(fn, delay) {
  let timer;
  return function () {
    let args = [...arguments];
    if (timer) {
      //清除上一次的定时器
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(this, args); //this显式绑定
    }, delay); //定时器会修改this指向 定时器词法环境大多数都是window
  };
}
function iDebounce(func, delay, immediate) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (immediate && !timer) {
      func.apply(this, arguments);
    }
    timer = setTimeout(() => {
      if (!immediate) {
        func.apply(this, arguments);
      }
      // timer = null;
    }, delay);
  };
}
