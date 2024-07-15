class Schedule {
  constructor() {
    this.queue = [];
    this.maxcount = 2; // 最大并发数
    this.runcount = 0; // 当前运行的任务数
  }
  add(task) {
    this.queue.push(task); // 将任务添加到队列中
  }
  taskstart() {
    for (let i = 0; i < this.maxcount; ++i) this.request(); // 启动初始的任务
  }
  request() {
    if (!this.queue || !this.queue.length || this.runcount >= this.maxcount)
      return; // 如果队列为空或者当前运行的任务数已达到最大并发数，则不再继续请求任务
    this.runcount++; // 当前运行的任务数加1
    this.queue
      .shift()() // 从队列中取出任务并执行
      .then(() => {
        this.runcount--; // 任务执行完成后，当前运行的任务数减1
        //if判断
        this.request(); // 继续请求任务
      });
  }
}
const schedule = new Schedule();
// 定义一个函数，返回一个新的Promise，该Promise在指定的时间后解决
const timeout = (time) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
// 定义一个函数，将一个新的任务添加到调度器
const addtask = (time, order) => {
  schedule.add(() => timeout(time).then(() => console.log(order))); // 将任务添加到调度器中
};
addtask(1000, 1);
addtask(500, 2);
addtask(300, 3);
addtask(400, 4);
schedule.taskstart(); // 启动调度器
