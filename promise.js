class mypromise {
    constructor(executor) {
      this.status = "pending";
      // 用于保存 resolve 或者 rejected 传入的值
      this.value = undefined;
      this.reason = undefined;
      // 用于保存 resolve 的回调函数
      this.onResolvedCallbacks = [];
      // 用于保存 reject 的回调函数
      this.onRejectedCallbacks = [];
  
      const resolve = (value) => {
        // 判断传入元素是否为 Promise 值，如果是，则状态改变必须等待前一个状态改变后再进行改变
        if (value instanceof mypromise) {
          return value.then(resolve, reject);
        }
        // 保证代码的执行顺序为本轮事件循环的末尾
        setTimeout(() => {
          // 只有状态为 pending 时才能转变
          if (this.status === "pending") {
            this.status = "resolved";
            this.value = value;
            this.onResolvedCallbacks.forEach((fn) => fn());
          }
        }, 0);
      };
  
      const reject = (reason) => {
        if (value instanceof mypromise) {
          return value.then(resolve, reject);
        }
        // 保证代码的执行顺序为本轮事件循环的末尾
        setTimeout(() => {
          if (this.status === "pending") {
            this.status = "rejected";
            this.reason = reason;
            this.onRejectedCallbacks.forEach((fn) => fn());
          }
        }, 0);
      };  
      // 执行执行器函数，并将 resolve 和 reject 函数作为参数传递进去
      try {
        executor(resolve, reject);
      } catch (e) {
        reject(e);
      }
    }
    // then 方法用于注册 fulfilled 和 rejected 状态的回调函数
    then(onFulfilled, onRejected) {
      //返回一个新的 Promise 对象
      return new mypromise((resolve, reject) => {
        // 首先判断两个参数是否为函数类型
        onFulfilled =
          typeof onFulfilled === "function" ? onFulfilled : (value) => value;
        onRejected =
          typeof onRejected === "function"
            ? onRejected
            : (reason) => {
                throw reason;
              };
        if (this.status === "resolved") {
          onFulfilled(this.value);
        }
        if (this.status === "rejected") {
          onRejected(this.reason);
        }
        // 如果是等待状态，则将函数加入对应列表中
        if (this.status === "pending") {
          this.onResolvedCallbacks.push(() => {
            onFulfilled(this.value);
          });
          this.onRejectedCallbacks.push(() => {
            onRejected(this.reason);
          });
        }
      });
    }
  }