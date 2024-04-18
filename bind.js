// 自定义 bind 方法
Function.prototype.myBind = function (context) {
  // 保存当前函数的引用
  const fn = this;
  // 返回一个新的函数
  return function () {
    // 在新函数中调用原函数，并将 context 作为 this 上下文
    return fn.apply(context, arguments);
  };
};
