// 自定义 bind 方法
Function.prototype.myBind = function (context) {
  if (typeof this !== "function") {
    //类型检查
    console.error("type error");
  }
  // 获取了除 context 之外的所有参数，并将它们保存在 args 变量中。这些参数将会被传递给原函数。
  let args = [...arguments].slice(1);
  //外部保存一个对原函数的引用。
  let fn = this;
  // 返回一个新的函数
  return function newFn() {
    // 在新函数中调用原函数，并将 context 作为 this 上下文
    return fn.apply(
      //需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用，其余情况都传入指定的上下文对象
      this instanceof newFn ? this : context,
      //新函数接受任意数量的参数，并将这些参数与 args 合并
      args.concat(...arguments)
    );
  };
};
Function.prototype.myCall = function (context) {
  if (typeof this !== "function") {
    //类型检查
    console.error("type error");
  }
  // 获取了除 context 之外的所有参数，并将它们保存在 args 变量中。这些参数将会被传递给原函数。
  let args = [...arguments].slice(1);
  let result = null;
  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;
  //在 context 对象上添加一个方法 fn
  const key = Symbol();
  context[key] = this;
  //将 args 作为参数传递
  result = context[key](...args);
  //删除 context 对象上的 fn 属性
  delete context[key];
  return result;
};
Function.prototype.myApply = function (context) {
  if (typeof this !== "function") {
    //类型检查
    console.error("type error");
  }
  let result = null;
  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;
  //在 context 对象上添加一个方法 fn
  const key = Symbol();
  context[key] = this;
  if (arguments[1]) {
    //存在args
    result = context[key](...arguments[1]);
  } else result = context[key](); //不存在，不传递任何参数
  //删除 context 对象上的 fn 属性
  delete context[key];
  return result;
};
//const count2 = addGrades.myApply(student, ['英语', 88, 91]);
