function debounce(fn, delay) {
  let timer = null,
    context = this,
    args = arguments;
  return function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
function iDebounce(func, delay, immediate) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate && !timer) {
      func.apply(this, arguments);
    }
    timer = setTimeout(() => {
      if (!immediate) {
        func.apply(this, arguments);
      }
      timer = null;
    }, delay);
  };
}
