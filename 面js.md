map set无序

用array.sort((a,b)=>a-b)(升序)必须写回调，不然是10<2

Math.max可传多个参数

Number.EPSILON 2的-52，比较：

Number.EPSILON-(0.1+0.2-0.3)<Number.EPSILON

typeof null是object，NaN是number 低地址

false：  undefined，null,0，0+，0-，nan，''

Object.is(a,b)在===上优化，之后-0 和 +0 不再相等，两个 NaN 是相等的

.map:filter:slice concat flat返回新数组

对象的取值.和[]都可以，例外特殊关键字如class或＄{}不能用 .

# 1拷贝

深拷贝 parse(stringfy()) (stringfy 数据结构转json字符串  parse 字符串转js数据结构)

浅 object.assign ...拓展运算符（对象同名属性会覆盖，要有**Iterator**才能转数组，）

# 2 闭包

**一个函数访问了此函数的父级及父级以上的作用域变量**

将变量封装在函数内部，避免全局污染，保护变量不被外部访问和修改。延长变量生命周期。可以创建私有变量和私有方法，实现模块化的封装和隐藏。

变量无法被垃圾回收，内存泄漏（一块被分配的内存既不能使用,又不能回收,直到浏览器进程结束，造成系统内存占用越来越大,最终导致程序运行缓慢甚至系统崩溃等严重后果），性能，常驻内存,增大内存使用量

- **特性**：

1. **函数嵌套**：闭包的实现依赖于函数嵌套，即在一个函数内部定义另一个函数。
2. **记忆外部变量**：闭包可以记住并访问外部函数的变量，即使外部函数已经执行完毕。
3. **延长作用域链**：闭包将外部函数的作用域链延长到内部函数中，使得内部函数可以访问外部函数的变量。
4. **返回函数**：闭包通常以函数的形式返回，使得外部函数的变量仍然可以被内部函数引用和使用

场景 节流防抖，自执行函数，柯里化，链式调用（封装计算器），（？函数里面定义函数）

for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
}

function包起来，内部为新参数，立即执行，可以正常输出。之前为5个6

```js
//计数器
var add=(function(){
var count=0
return function(){
return count++
}
})()
```

内存泄漏 performance查看，下降高度不同

1不再需要闭包时，手动将引用置为null

```js
const myClosure = createClosure();
// 使用后清理
myClosure();
myClosure = null;
```

2引用的外部变量是对象，可以使用WeakMap或WeakSet来存储对象的引用。WeakMap和WeakSet是弱引用的集合，当对象没有其他引用时，垃圾回收机制会自动回收对象。

```js
 weakMap.set(obj, 'cached data');
    return function getData() {
        return weakMap.get(obj);
    };
```

3避免循环引用：内部引用外部，外部引内部

```js
const button = document.getElementById('myButton');
    function handleClick() {
        console.log('Button clicked!');
        // 清理工作，解除引用
        button.removeEventListener('click', handleClick);
    }
    button.addEventListener('click', handleClick);
```

4将闭包封装在立即执行函数中，当立即执行函数执行完毕后，其中的变量就会被销毁。(function() { ... })()或(function() { ... }())



# 3 柯里化curry hand

将使用多个参数的一个函数转换成一系列使用一个参数的函数，可以传递一个或多个参数

只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。 你可以一次性地调用 curry 函数，也可以每次只传一个参数分多次调用。

已经柯里化后的 _fn 函数，当接收的参数数量与原函数的形参数量相同时，执行原函数； 当接收的参数数量小于原函数的形参数量时，返回一个函数用于接收剩余的参数，直至接收的参数数量与形参数量一致，执行原函数

# 4bind、call和apply hand

this执行上下文中的一个属性，它指向最后一次调用这个方法的对象

显式设置this值（**改变执行时的上下文**），都是绑定在Function构造函数的`prototype`上

**bind(thisArg, arg1, arg2, ...)**this要指向的对象，传递给函数的参数。返回一个新函数，可以稍后调用

**call(thisArg, arg1, arg2, ...)**立即执行

**apply(thisArg, [argsArray])**一个包含参数的数组或类数组，立即执行

```
Math.max.apply(null,arr)或者Math.max(...arr)
```

# 5async await

generator语法糖，自动执行器

```js
function *(){
yield 
}
```

# 6for hand

for in遍历对象的所有可枚举属性Key,遍历整个原型链上，输出下标
for in无法遍历「稀疏」数组 arr=[,,2]//只有2                     //of会输出undefined
for of遍历iterable对象的值（要有迭代器，Object.entries()）输出值

# 7|| &&

&& 运算，如果前面值为true,则结果为后面的值。如果前面值为false,则值为前值. 

|| 运算，如果前面值为true,则结果为前面的值,如果前面的值为false,则结果为后面的值。

# 8ES6

let const 解构 ... 模板字符串  字符串（includes startswith endswith repeat）

# 9变量提升

 js 引擎在代码执行前有一个解析的过程，创建了执行上下文

JS代码执行之前，会进行语法检查和预编译，并且这一操作只进行一次。为了提高性能

函数是整个函数体提升，可以调用。 let ar=function或箭头函数调用会报错

# 10ajax hand

创建交互式网页应用的网页开发技术。它是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术

fetch **原生js，没有使用XMLHttpRequest对象**。基于promise。400 500都当作成功不会reject，不带cookie，fetch(url, {credentials: 'include'}) 需要先then(r=>r.json()).then()

# 



# 11map weakmap

map本质上就是键值对的集合，但是普通的Object中的键值对中的键只能是字符串。map的键不限制范围，可以是任意类型.keys(),values,entries

WeakMap 键是弱引用的。**其键必须是对象**。一旦不再被引用，WeakMap 里面的**键名对象和所对应的键值对会自动消失，不用手动删除引用**，不计入垃圾回收机制

# 原型

![image-20240823132010279](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240823132010279.png)

![image-20240823132032528](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240823132032528.png)

# promise

allsetteled，any



try catch不能异步捕获错误(`try/catch` 只能监控当前执行栈中的错误，事件循环中的不行，`try/catch` 执行结束了)，应该采用settimeout,promise链等。错误：try里面settimeout，正确：settimeout里面try

foreach不会等待异步结束，用for

# jsbridge

 使原生代码能和嵌入到webview的js相互调用通信

# 数据防篡改 

object.freeze不能新增修改删除，深层嵌套，seal只是可以修改，不会深层，实现：proxy set里面抛error



封装 class类里面可以private public

继承 extends

多态 方法重写，不同对象调用不同结果

## 设计模式

单例模式 vuex 一个store 以及pinia直接默认调用  进程中只有一个实例

观察者 watch 定义对象间的一对多依赖关系，当一个对象状态变化时，自动通知所有依赖它的对象。

代理模式 proxy控制访问  通过代理对象控制对原始对象的访问，增强其功能。

依赖注入模式 provide inject  高层模块不依赖低层模块的具体实现，而是通过抽象接口传递依赖。

# 题

利用1到7（x）的随机数生成1到10的随机数，等概率

ran-1得到0-6(x)，再×7(x)得到0,7,14,21,28,35,42等概率，每个加上ran得到0-49(x2)等概率，

只考虑if(n<40)时，%10+1就可以了