//原型链
function Parent() {
  this.name = "parent";
}
function Children() {}
Children.prototype = new Parent();
let a = new Children();

//构造函数
function Parent1() {
  this.name = "parent";
}
function Children1() {
  Parent1.call(this);
}
let a1 = new Children1();

//组合式
function Parent2() {
  this.name = "parent";
}
function Children2() {
  Parent2.call(this);
}
Children2.prototype = new Parent2();
let a2 = new Children2();
