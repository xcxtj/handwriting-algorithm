//原型链
//令一个构造函数的原型等于另一个不同构造函数的实例
//引用类型属性无法私有化(别人可以改),不能向父类型构造函数中传递参数
function Parent() {
  this.name = "parent";
}
function Children() {}
Children.prototype = new Parent();
let a = new Children();

//构造函数
//通过call实现的继承本质是改变了this指向，
//让父类里面的this指到子类的上下文，
//这样在父类里面通过this设置的属性或者方法会被写到子类上面
//缺陷： 若在构造函数内部定义方法时，每个方法都要在每个对象实例上重新创建一遍
//不能继承父类原型上的属性和方法
function Parent1() {
  this.name = "parent";
}
function Children1() {
  Parent1.call(this);
}
let a1 = new Children1();

//组合式
//父类构造函数会被执行两次分别在 fun.call(this) 和 obj.prototype = new fun()，
//而且父类构造函数上的属性在子类自身和子类的原型上都存在
function Parent2() {
  this.name = "parent";
}
function Children2() {
  Parent2.call(this);
}
Children2.prototype = new Parent2();
let a2 = new Children2();

//优化
//如果对子类型构造函数的原型做了修改，那么这个修改同时也会影响到父类型构造函数的原型
Children2.prototype = Parent2.prototype;
// Children2.prototype = new Parent2();

//Object.create 实现继承
//Object.assign(target, source, ...) 将所有可枚举属性的值从一个或多个源对象分配到目标对象；并返回目标对象。可用于做对象拷贝，
Children2.prototype = Object.create(Parent2.prototype);
//Children2.prototype = Parent2.prototype;

//class方法

//继承多个object.assign