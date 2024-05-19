map set无序

用array.sort((a,b)=>a-b)(升序)必须写回调，不然是10<2

Math.max可传多个参数

Number.EPSILON 2的-52

typeof null是object，nan是number

false  undefined，null,0，0+，0-，nan，''

Object.is()在===上优化，-0 和 +0 不再相等，两个 NaN 是相等的

.map:filter:slice concat flat返回新数组



# 1拷贝

深拷贝 parse(stringfy()) (stringfy 数据结构转json字符串  parse 字符串转js数据结构)

浅 object.assign ...拓展运算符（对象同名属性会覆盖，要有**Iterator**才能转数组，）

# 2 闭包

**一个函数访问了此函数的父级及父级以上的作用域变量**

将变量封装在函数内部，避免全局污染，保护变量不被外部访问和修改。延长变量生命周期。可以创建私有变量和私有方法，实现模块化的封装和隐藏。

变量无法被垃圾回收，内存泄漏，性能

- **特性**：

1. **函数嵌套**：闭包的实现依赖于函数嵌套，即在一个函数内部定义另一个函数。
2. **记忆外部变量**：闭包可以记住并访问外部函数的变量，即使外部函数已经执行完毕。
3. **延长作用域链**：闭包将外部函数的作用域链延长到内部函数中，使得内部函数可以访问外部函数的变量。
4. **返回函数**：闭包通常以函数的形式返回，使得外部函数的变量仍然可以被内部函数引用和使用

场景 节流防抖，自执行函数，柯里化，链式调用（封装计算器），（？函数里面定义函数）

```js
//计数器
var add=(function(){
var count=0
return function(){
return count++
}
})()
```



# 3 柯里化curry hand

将使用多个参数的一个函数转换成一系列使用一个参数的函数，可以传递一个或多个参数

只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。 你可以一次性地调用 curry 函数，也可以每次只传一个参数分多次调用。

已经柯里化后的 _fn 函数，当接收的参数数量与原函数的形参数量相同时，执行原函数； 当接收的参数数量小于原函数的形参数量时，返回一个函数用于接收剩余的参数，直至接收的参数数量与形参数量一致，执行原函数

# 4bind、call和apply hand

this执行上下文中的一个属性，它指向最后一次调用这个方法的对象

显式设置this值（**改变执行时的上下文**），都是绑定在Function构造函数的`prototype`上

**bind(thisArg, arg1, arg2, ...)**this要指向的对象，传递给函数的参数。返回一个新函数，可以稍后调用

**call(thisArg, arg1, arg2, ...)**立即执行

**apply(thisArg, [argsArray])**包含参数的数组或类数组，立即执行

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

# 6for

for in遍历对象的所有可枚举属性Key,遍历整个原型链上
for in无法遍历「稀疏」数组 arr=[,,2]//只有2 //of会输出undefined
for of遍历iterable对象的值（要有迭代器，Object.entries()）

# 7|| &&

&& 运算，如果前面值为true,则结果为后面的值。如果前面值为false,则值为前值. 

|| 运算，如果前面值为true,则结果为前面的值,如果前面的值为false,则结果为后面的值。

# 8ES6

let const 解构 模板字符串  字符串（includes startswith endswith repeat）

# 9变量提升

 js 引擎在代码执行前有一个解析的过程，创建了执行上下文

JS代码执行之前，会进行语法检查和预编译，并且这一操作只进行一次。为了提高性能







# 10ajax hand

创建交互式[网页](https://link.zhihu.com/?target=https%3A//baike.baidu.com/item/%E7%BD%91%E9%A1%B5)应用的网页开发技术。它是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术

fetch **原生js，没有使用XMLHttpRequest对象**。基于promise

# 



# map weakmap

map本质上就是键值对的集合，但是普通的Object中的键值对中的键只能是字符串.map的键不限制范围，可以是任意类型.keys(),values,entries

WeakMap 键是弱引用的。**其键必须是对象**。一旦不再被引用，WeakMap 里面的**键名对象和所对应的键值对会自动消失，不用手动删除引用**，不计入垃圾回收机制