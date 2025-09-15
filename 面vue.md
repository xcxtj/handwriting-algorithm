# vue2和3区别

响应式defineproperty proxy

diff算法

选项**Options**  组合**Composition** api

setup语法糖

store vuex pinia

生命周期

打包webpack vite esbuild

# 观察和发布订阅

观察者 一个对象维护一个依赖列表，状态发生变化通知观察者
发布订阅 发布者发生变化通知信息中介(订阅者在这里注册)，中介通知对应订阅者
区别： 

发布订阅不知道彼此存在，组件解耦，异步(消息队列
观察者大多数同步(触发就通知)

# 响应式原理

数据》视图

```vue
let data ;let vm={}
Object.defineProperty(vm,data,{
get(){},
set(){}
})
```

```
let data= {
        name: '张三',
    }
let p=new Proxy(data,{
get(){},
set(){}
})
```

```
捕获修改
let p = new Proxy(person,{
        get(target,prop){
            return Reflect.get(target,prop)
        },
        set(target,prop,value){
            return Reflect.set(target,prop,value)
        },
        deleteProperty(target,prop){
            return Reflect.deleteProperty(target,prop)
        }
    })
```

使用 `Reflect` 对象来操作目标对象，而不是直接操作目标对象本身

更符合规范，易于阅读  更安全，方法会返回一个布尔值，指示是否成功

**Object.defineProperty** **直接修改原对象**,只能监听 **指定对象、指定属性** 的响应性,对返回的复杂数据类型进行循环监听，vue.$set(对于新增，相当于主动触发了一次 Object.defineProperty)

**Proxy 可以直接监听对象的所有key** ，proxy实现的过程是在目标对象之前设置了一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

得到一个新的对象（代理对象），同时拥有被代理对象中所有的属性。

### 嵌套代理

**Object.defineProperty**直接递归调用，通过给所有层级的所有key建立对应的 getter、setter

**Proxy 对于嵌套赋值，会触发 get，** **若获取的是 object 则返回 Proxy**， **等到触发了某个嵌套对象，才进行监听**

对于Object.defineProperty
		

![image-20240520133014915](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240520133014915.png)

mvvm双向绑定

vue.js 则是采用数据劫持结合发布者-订阅者模式的方式

数据到视图

通过`Object.defineProperty()`来劫持各个属性的`setter`，`getter`，在数据变动时发布消息给订阅者，触发相应的监听回调。

1数据监听器Observer，数据对象进行递归遍历监听，包括子属性对象的属性，都加上 setter和getter 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。每个响应式属性对应一个 `Dep` 实例，负责管理依赖
2指令解析器Compile，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
(1)在自身实例化时往属性订阅器(dep)里面添加自己
(2)自身必须有一个update()方法
(3)待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

4MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

视图到数据

解析器将模板编译为渲染函数，解析指令vmodel，语法糖自动绑定value和 input。视图变化触发 DOM 事件，修改响应式数据。触发setter，通知watcher，更新视图

![image-20240620141715869](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240620141715869.png)



Vue的响应式原理是Vue框架的核心特性之一，它确保了当数据模型发生变化时，视图会自动更新。这一机制主要依赖于JavaScript中的Object.defineProperty方法来实现。

以下是Vue响应式原理的详细解释：

### 1. 数据劫持（Data Hijacking）

当Vue实例被创建时，它的data对象中的所有属性都会被遍历。Vue通过Object.defineProperty对这些属性进行劫持（或称数据绑定），为每个属性创建一个getter和setter。

- **getter**：当读取数据时，getter会被触发，它会记录这个数据的依赖关系，即谁在读取这个数据。
- **setter**：当修改数据时，setter会被触发，它会通知所有依赖这个数据的变化的视图或组件，告诉它们数据已经发生了变化。

### 2. 依赖收集（Dependency Collection）

在组件渲染过程中，如果某个数据被读取，Vue会记录这个数据与当前组件的依赖关系。这一过程称为依赖收集。Vue通过一种叫做“依赖收集”的机制，将数据和视图建立起联系。

### 3. 发布-订阅模式（Publisher-Subscriber Pattern）

Vue的响应式系统采用了发布-订阅模式。每个组件实例都有一个watcher实例，它会在组件渲染的过程中被创建。当数据变动时，setter会通知所有订阅了该数据的watcher实例，然后这些watcher会调用它们的回调函数，促使视图重新更新。

### 5. 异步更新队列

Vue的响应式系统实际上使用了异步更新队列，以提高性能。当数据变化时，Vue不会立即更新DOM，而是开启一个队列，并缓冲在同一个事件循环中发生的所有数据改变。如果同一个watcher被多次触发，只会被推入到队列中一次。这种去重和缓冲的机制意味着只有真正需要更新的视图才会被重新渲染，减少不必要的DOM操作。

通过这种方式，Vue的响应式系统确保了数据和视图之间的同步，并且提高了性能和效率。这种设计使得状态管理变得更加简单和直观，同时，由于不需要手动操作DOM，也大大提升了代码的可维护性和可读性。



vue2 defineproperty递归地遍历对象的每一层级所有属性，设置getter setter，嵌套的深层对象性能问题。数组方法重写（push pop），不支持 Set、Map 等复杂数据结构。vue2改数组，用＄set

vue3 `Proxy`可以监听对象的所有操作，不用深度遍历，只有在访问某些属性时才会进行响应式处理



# 事件循环

这种设计是为了给紧急任务一个插队的机会，否则新入队的任务永远被放在队尾，避免了某些情况下宏任务队列中的任务阻塞了关键逻辑的执行，提高了响应速度和用户体验。微任务执行快，所做的状态修改，在下一轮事件循环中也能得到同步

宏任务是由宿主环境（如浏览器或 Node.js）提供的任务，那些需要较长时间才能完成的任务，通常涉及I/O操作，

1. setTimeout 和 setInterval

2. **I/O 操作：**包括文件读写、网络请求等异步操作。

3. 事件回调


微任务是在当前任务执行结束后立即执行的任务，它可以在当前任务之后、下一个宏任务之前执行。在同一轮事件循环中的宏任务结束后立即执行。在当前宏任务中的 JavaScript 快执行完成时，也就在 JavaScript 引擎准备退出全局执行上下文并清空调用栈的时候，JavaScript 引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务

在执行微任务过程中产生的新的微任务并不会推迟到下个宏任务中执行，而是在当前的宏任务中继续执行

1. Promise 回调：
2. **MutationObserver：**监控某个 DOM 节点，然后再通过 JavaScript 来修改这个节点，或者为这个节点添加、删除部分子节点，当 DOM 节点发生变化时，就会产生 DOM 变化记录的微任务
3. process.nextTick

```js
new Promise(function(resolve) {
    console.log('promise1');//promise立即执行的
    resolve();//加入微任务
}    
async function async1() {
    console.log('async1 start');//立即执行
    await async2();//async2执行完后返回一个promise要等，，后面加入微任务
    console.log('async1 end');
}
async function async2() {//async返回一个promise
    console.log('async2');
}
```



# vdom diff hand

vue2双端 Diff 对比，vue3快速diff

vdom是JS模拟的DOM结构，将DOM的比对操作放在JS层，减少浏览器不必要的重绘，提高效率。性能不是绝对更好

diff同层比较  从n3（对比需要n2，更改需要n）到O（n）

**sameVnode**

判断两个节点是否相同，并不是完全一模一样，而是关键属性一样

对比comment，placeholder

```js
function sameVnode(a, b) {    
    return (
        //key 属性, tag 属性是否相等, 是否是input 节点
        //!! 是一个逻辑运算符，用于将值转换为布尔类型。data 属性是否都存在或都不存在,data可以不同  ??如果为null或undefined时返回个默认值
        a.key === b.key &&
        a.tag === b.tag &&
        !!a.data === !!b.data &&
        sameInputType(a, b)
    )
}
```

**patch**

如果两个vnode相等，不需要 patch。

如果是异步占位，执行 `hydrate` 方法或者定义`isAsyncPlaceholder` 为 true，然后退出。

如果两个vnode都为静态，不用更新，所以将以前的`componentInstance` 实例传给当前 vnode。 退出patch

不存在文本节点的情况下，当旧节点的子节点和新节点的子节点都存在且不等的情况下，开始diff算法

当旧节点没有子节点但新的有，检查新节点子节点的key的重复性.清空文本节点。然后批量将新节点的子节点添加到elem后面

如果新节点没有子节点但是旧节点有子节点，则清空旧节点的文本内容，移除子节点

都没有，若新旧节点文本内容不同则替换。



比较规则

不会对两个数组进行改变（比如不会插入，不会删除其子项）而所有比较过程中都是直接 插入删除 真实页面DOM

1新前与旧前相同，新后与旧后相同都是更新即可

是sameVnode就patchVnode（继续处理这两个相同节点的子节点，或者更新文本），index更新

2新后与旧前相同，旧前移动到旧中所有未处理节点的最后面

```js
parentElm.insertBefore(oldStartVnode.elm,oldEndVnode.elm.nextSibling);
```

4新前与旧后相同，旧后移动到旧中所有未处理节点的最前面

```js
parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
```

5都不同

生成旧子节点数组以 vnode.key 为key 的 map 表

拿新前判断它的key是否在上面的map 中 

```
oldKeyToIdx[newStartVnode.key]
```

不存在，则新建DOM。

```
createElm(newStartVnode, parentElm, oldStartVnode.elm)
```

存在，继续判断是否 sameVnode

```
parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm);
```

开始位置大于等于结束位置，说明所有节点都遍历过了，则结束循环，新的还有添加，旧的还有删除

```js
parentNode.removeChild(el);
    或者
    createElm(newCh[newStartIdx], parentElm, refElm//refElm 获取的是 newEndIdx 后一位的节点
    );
```

**vue3在diff算法中相比vue2增加了静态标记**, 其作用是为了**会发生变化的地方添加一个flag标记**，下次发生变化的时候直接找该地方进行比较,提高性能  (？不变的加标记，跳过处理

避免每次渲染时重复创建静态节点（无动态绑定的节点）

300最长递增子序列lis，不连续，hand

```
dp初始1，每轮[0,i),if numj<numi递增,dp=max(dp[i], dp[j] + 1)，记录开始位置
```

vue3对新旧子节点的预处理过程。

1. 用一个**指针 i 指向新旧子节点的头结点**； `while` 循环遍历，针对相同前置节点使用 `patch` 打补丁，当遇到不同的节点时停止循环；
2. 用**两个指针 newEnd、oldEnd 分别指向新旧子节点的尾结点**；`while` 循环遍历，针对相同后置节点使用 `patch` 打补丁，当遇到不同的节点时停止循环；
   - `oldEnd <= i && newEnd <= i`：说明新旧子节点全部都处理完毕了；
   - `i > oldEnd && i <= newEnd`：说明 `i` 至 `newEnd` 区间内的节点需要被挂载；
   - `i > newEnd && i <= oldEnd`：说明 `i` 至 `oldEnd` 这个区间内的节点都需要被卸载；
   - 其他情况，快速diff

？也会比较**头尾相同**

乱序处理，扫描旧的，保存对应旧的索引，求lis。逆序处理新的非lis的dom

例如C, D, E, A, B减少次数，更明显3 4 ... 999 1 2

先建数组source初始-1，存储**新子节点在旧子节点中的位置索引**。对新的索引表keyToIndex ={key:index},遍历旧的，看k=keyToIndex[oldVnode.key]，没有就卸载，有patch再更新source，记录已经patch的数量，>=新节点时后面旧的就删除。比较k和pos，如果 k < pos，说明需要移动节点mov=true， 否则更新 pos 的值为k

如果k一直递增，就不需要移动任何节点

从source求最长递增子序列seq（是source的索引，不唯一），倒序遍历seqj和source的下标i，source为-1**全新的节点**，插入到队尾mount，i==seqj时不用移动，否则插到队尾**insetBefore**（队尾已排好）

![image-20240620154021138](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240620154021138.png)

#### **区块树（Block Tree）优化**

- **动态节点标记**：在编译阶段标记动态节点（如含 `v-if`、`v-for` 的节点）。
- **优化效果**：父节点变化时，若子区块稳定（无动态结构），跳过子树的 Diff 过程。减少不必要的子树遍历。



# vue3的优化

Tree shaking 编译阶段利用ES6 Module判断哪些模块已经加载。判断那些模块和变量未被使用或者引用，进而删除对应代码

**Vue3中对不参与更新的元素，会做静态提升**，只会被提前创建一次，在渲染时直接复用。这样就免去了重复的创建节点，大型应用会受益于这个改动，免去了重复的创建操作，优化了运行时候的内存占用

vue2的Object.defineProperty： 检测不到对象属性的添加和删除，数组API方法无法监听到，需要对每个属性进行遍历监听，如果嵌套对象，需要深层监听，造成性能问题

proxy监听整个对象，惰性监听。 Proxy 并不能监听到内部深层次的对象变化，而 Vue3 的处理方式是在 getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归

vue2数组进行 push 添加新元素时，需要针对于该元素再调用 Object.defineProperty 进行劫持操作实现响应式，并通知更新，所以需要扩展原有的 push 方法

vue3当使用 `Proxy` 对象来创建响应式数组时，如果数组中的元素是引用类型（例如对象或数组），代理对象会生成新的代理，而不是直接返回原始引用。这会影响数组查找操作（如 `indexOf`、`includes` 等），因为这些操作依赖于引用相等性。const obj = { id: 1 }; const reactiveArray = reactive([obj]);reactiveArray 中存的是一个obj的proxy代理对象，不是直接引用。调用includes(obj)会去相等性寻找，遇到代理对象，而不是 `obj` 本身，就失败了。

Vue 3 重写了数组的这些查找方法。代理后的数组中查找不到元素时，会在原始数组中再进行一次查找。两次查找



# axios hand

拦截器 需要设置多个

请求拦截：axios请求拦截会先执行最后指定的回调函数，依次向前面执行，先进后出

响应拦截：axios响应拦截会先执行最先指定的回调函数，依次向后面执行，先进先出

Loading效果能很好的加强用户体验，避免重复请求,采用ElLoading   hand

**内部有个计数器，确保同一时刻如果有多个请求的话，不会同时出现多个 loading，而是只有 1 个。并且在所有请求结束后才会隐藏 loading**

封装

# token过期

axios response拦截器判断返回401，用refreshtoken重新请求accesstoken，失败跳login，存到本地，再重新请求。本地不建议判断失效超时重试，axios的response error里判断。没有config，重试次数，reject，去login。没超过次数，重试，.then instance(config)

服务器返回的 Cookie 满足条件（domain，path，有效等），浏览器就会在后续请求中**自动携带**（包括httponly的）

# v8的jit即时编译

默认是解释执行，启动快。代码多次执行，jit编译器介入编译成机器语言。不牺牲启动速度的情况下，提供接近编译语言的运行速度

# vite

webpack:打包：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件。冷启动开发服务器时，基于打包器的方式启动必须优先抓取并构建你的整个应用,要很长时间才能启动开发服务器，即使使用模块热替换（HMR），热更新速度也会随着应用规模的增长而显著下降，文件修改后的效果也需要几秒钟才能在浏览器中反映出来

HMR：允许一个模块 “热替换” 它自己，而不会影响页面其余部分

1**依赖** 大多为在开发时不会变动的纯 JavaScript，(组件库)。Vite 将会使用 esbuild 预构建依赖（npm引入的包都是CommonJS的，所以需要转换为ESM，会缓存）,比以 JavaScript 编写的打包器预构建依赖快 10-100 倍.

Esbuild 使用 Go 语言编写,JavaScript 是一门解释型语言，而 Go 是一种编译型语言。Go 具有多线程运行能力，而 JavaScript 是一门单线程语言。

解释型语言执行时才被解释器一行行动态翻译和执行，每次都要解释

编译型语言一次性的编译成平台相关的机器语言文件，直接使用编译结果

2**源码** 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载。

Vite 以 [原生 ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码

**快速冷启动**：只启动一台静态页面的服务器，对文件代码不打包，服务器会根据客户端的请求加载不同的模块处理（利用的是浏览器对esMoudle的原生支持），所以节省了webpack 那一套打包转化封装的逻辑。

**按需编译、模块热更新：**采用立即编译当前修改文件的办法。同时 vite 还会使用缓存机制( http 缓存 => vite 内置缓存 )**是基于缓存的热更新**。

文件缓存：Vite 会将预构建的依赖缓存到`node_modules/.vite`。它根据几个源来决定是否需要重新运行预构建步骤:`package.json` 中的 `dependencies` 列表， package-lock等

浏览器缓存：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，依赖模块请求会以 HTTP 头 `max-age=31536000,immutable` 强缓存，以提高在开发时的页面重载性能。一旦被缓存，这些请求将永远不会再到达开发服务器

**生产环境仍用Rollup打包**： 由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）

不用 ESBuild 打包，Vite 目前的插件 API 与使用 `esbuild` 作为打包器并不兼容

### 模块化

CommonJS规范主要用于服务端编程，加载模块是同步的，意味着阻塞加载，require引入，exports或module.exports来导出

对于基本数据类型，属于复制。即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值。

对于复杂数据类型，属于浅拷贝。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值做修改时会影响另一个模块。

当使用require命令加载某个模块时，就会运行整个模块的代码。

当使用require命令加载同一个模块时，不会再执行该模块，而是取到缓存之中的值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。

循环加载时，属于加载时执行。即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

ESMoudle：export / export default 导出， import 进行导入，编译时确定依赖关系,对模块的引用，只读

对于只读来说，即不允许修改引入变量的值，import的变量是只读的，不论是基本数据类型还是复杂数据类型。当模块遇到import命令时，不会去执行模块，就会生成一个动态的只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

对于动态来说，原始值发生变化，import加载的值也会发生变化。不论是基本数据类型还是复杂数据类型。

循环加载时，ES6模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行。

### 环境变量

```
import.meta.env.MODE: {string} 应用运行的模式。
import.meta.env.BASE_URL: {string} 部署应用时的基本 URL。他由base配置项决定。
import.meta.env.PROD: {boolean} 应用是否运行在生产环境。
import.meta.env.DEV: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD相反)。
import.meta.env.SSR: {boolean} 应用是否运行在 server 上。


```

### import()动态引入

不能起别名a=import()，返回一个promise

文件不是作为模块运行（如果在 HTML 文件中引用它，则脚本标记必须具有 `type="module"` ），不能静态引入，可以动态

# webpack

Loader的主要作用是转换文件 对模块源码的转换 处理非javascript模块 babel css style url（base64）?SourceMap  本质上，是将所有类型的文件，转换为应用程序的依赖图，可以直接引用的模块。

Plugin用于扩展webpack的功能 解决loader无法实现的其他事 HotModuleReplacement Eslint

```js
module.exports = {
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:6].js'
    },
    plugins: [
 	 new HtmlWebpackPlugin({
   		title: 'webpack demo',
  	})
 	],
    module: {
     loaders: [
      {
        test: /\.we(\?[^?]+)?$/,
        loaders: ['weex-loader']
      }
    ]
        
  }


```

chunk是webpack打包过程中modules的集合；bundle是我们最终输出的一个或者多个打包好的文件

打包过程

1初始化参数：在webpack.config.js 2、开始编译：初始化一个compiler对象，加载所有的配置，开始执行编译； 3、确认入口：根据entry中的配置，找出所有的入口文件； 4、编译模块：从入口文件开始，调用所有的loader，再去递归找依赖； 5、完成模块编译：得到每个模块被编译后最终的内容以及他们之间的依赖关系； 6、输出资源：根据得到的依赖关系，组装成一个个包含多个module的chunk； 7、输出完成：根据配置，确定要输出的文件名以及文件路径。

优化性能 压缩代码，cdn资源，tree shaking, code splitting

加速 缓存，缩小搜索范围include exclude，多线程thread-loader

hmr 要把该模块的相关依赖模块也全部编译一次

**解析**：从入口点开始，解析项目中的每个模块，识别出模块间的依赖关系，构建依赖图

**转换**：调用loader处理

**打包** 根据依赖关系，将模块 依赖项打包成chunk

**输出** 所有模块打包成bundle

vite 启动开发服务器，不打包，使用浏览器原生 ES 模块导入。按需编译文件，只在浏览器请求时处理。esbuild

模块加载时，先检查缓存。如果同一个加载多次，只执行一次，缓存
split chunks拆分
异步懒加载chunk
loader接收前一个loader的返回值为参数
plugin扩展器，可以监听打包过程的某些节点事件
运行流程 初始化参数，遍历entry入口，loader编译，输出文件



# 生命周期

**beforeCreate**在实例初始化之后、进行数据侦听和事件/侦听器的配置之前同步调用。**setup**()`setup` 函数会比 `beforeCreate` 与 `created` 先执行，记住它是入口，会最先跑。

**created**在实例创建完成后被立即同步调用，这个阶段挂载还没开始，所以 `$el` 还不能使用。**setup**()同上

**beforeMount**在挂载开始之前被调用，相关的 `render` 函数首次被调用，`$el` 依旧还不能用。**onBeforeMount**相同

**mounted**在实例挂载完成后被调用，这个时候 `$el` 能使用，但是这个阶段不能保证所有的子组件都挂载完成，如果你希望等待整个视图渲染完毕，可以使用 `$nextTick`（下一次dom更新。修改了响应式数据后，Vue 不会立即更新 DOM，而是等待本轮更新周期结束后批量更新）。**onMounted**相同

**beforeUpdate**在数据发生改变后，DOM 被更新之前被调用（使用该钩子要注意死循环）。**onBeforeUpdate**相同

**updated**在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用（使用该钩子要注意死循环）。**onUpdated**相同

**beforeDestroy**实例销毁之前调用，但在这一步，实例仍然完全可用。**onBeforeUnmount**相同

**destroyed**实例销毁后调用，包括子实例也会被销毁。**onUnmounted**相同

# ref reactive 

核心都是监听 setter 和 getter ，然后触发 effect 的方式

proxy es6引入，创建对对象的代理，不支持基本数据类型。转成包装类{value：}处理，类似String

reactive 通过 proxy 进行的响应式实现，监听复杂数据类型的 getter 和 setter 行为，getter收集当前的依赖行为effect，与这个属性关联起来，setter触发所有依赖effect，更新视图。但是 proxy 只能监听复杂数据类型，没有办法监听简单数据类型

**`ref` 是在 `reactive` 上在进行了封装**，增强了其能力，使它支持了对原始数据类型的处理，get value 和 set value 标记的方式,通知更新。ref返回的对象只有.value属性，proxy对其拦截监听get set。复杂数据类型时，会直接通过 toReactive 方法交给reactive

toRef 把 `reactive` 创建的响应对象中的某个属性变成一个单独的 `ref` ，与原对象是保持响应式连接的。

直接对 `reactive` 创建的对象解构，会失去响应式

toRefs 将 `reactive` 创建的响应对象中每个属性变成单独的 `ref`,解构可以直接使用

标签的 ref 属性用于注册模板引用

# watch

watch只能监视以下**四种数据**：

> 1. `ref`定义的数据。
> 2. `reactive`定义的数据。
> 3. 函数返回一个值（`getter`函数）。
> 4. 一个包含上述内容的数组。

对于ref要手动开启深度监视，reactive默认深度(响应也是)

监视某个属性，写成函数式

手动停止watch，调用返回值 

```js
let st=watch(,()=>{}); st()
```

watchEffect立即执行   不用明确指出监视的数据（函数中用到哪些属性，那就监视哪些属性）只要这些响应数据发生变化，就会触发 watchEffect

# 组件通信 

vue2和3对比：移出事件总线，使用`mitt`代替。vuex`换成了`pinia`。把`.sync`优化到了`v-model`里面了。把`$listeners`所有的东西，合并到`$attrs`中了。 `$children`被砍掉了

![image-20240516153321080](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240516153321080.png)

props若 **父传子**：属性值是**非函数**。若 **子传父**：属性值是**函数**

自定义事件：事件名是任意名称。事件对象`$event`: 是调用`emit`时所提供的数据，可以是任意类型

```vue
<!--在父组件中，给子组件绑定自定义事件：-->
<Child @send-toy="toy = $event"/>

<!--注意区分原生事件与自定义事件中的$event-->
<button @click="toy = $event">测试</button>
```

```js
//子组件中，触发事件：
this.$emit('send-toy', 具体数据)
```

`v-model`的本质

```vue
<!-- 使用v-model指令 -->
<input type="text" v-model="userName">

<!-- v-model的本质是下面这行代码 -->
<!-- v-bind, v-on -->
<input 
  type="text" 
  :value="userName" 
  @input="userName =(<HTMLInputElement>$event.target).value"
>
```

组件标签上的`v-model`的本质：`:modelValue` ＋ `@update:modelValue`事件。

```vue
<!-- 也可以更换value，例如改成abc-->
<AtguiguInput v-model:abc="userName"/>

<!-- 上面代码的本质如下 -->
<AtguiguInput :abc="userName" @update:abc="userName = $event"/>
```

子`AtguiguInput`组件中：

```vue
<template>
  <div class="box">
    <!--将接收的value值赋给input元素的value属性，目的是：为了呈现数据 -->
		<!--给input元素绑定原生input事件，触发input事件时，进而触发update:model-value事件-->
    <input 
       type="text" 
       :value="abc" 
       @input="emit('update:abc',$event.target.value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
  // 接收props
  defineProps(['abc'])
  // 声明事件
  const emit = defineEmits(['update:abc'])//defineEmits<{ (e: "update:abc", pageNo: number): any }>()
</script>
```

`$attrs`用于实现**当前组件的父组件**，向**当前组件的子组件**通信（**祖→孙**）

在祖先组件中通过`provide`配置向后代组件提供数据(key,要注入的值).在后代组件中通过`inject`配置来声明接收数据

全局API

app.config.xxx，app.component，app.directive，app.mixin，app.use，app.mount，app.config.globalProperties，app.provide，unmount

# v-model

```vue
自定义组件v-model为:modelValue="msg"@update:modelValue="msg=$event"
表单还是value/checked和input/change
```

移除了 model 选项，一个组件可以多个vmodel

```
defineProps({
  firstName: String,
  lastName: String
})
defineEmits(['update:firstName', 'update:lastName'])
```

```
3.4以后 const count = defineModel("参数1")
```

# 事件委托

事件委托适合 动态生成的元素，需要动态绑定事件的。

缺点： 大量元素，事件多会占用内存性能。一类元素事件可统一绑定





# pinia

存储库，它允许您跨组件/页面共享状态，响应式

更加轻量级。完整的 `TS` 的支持。移除 `mutations`，只剩下 `state` 、 `actions` 、 `getters` 。没有了像 `Vuex` 那样的模块镶嵌结构，它只有 `store` 概念，并支持多个 `store`，且都是互相独立隔离的。无需手动添加每个 `store`，它的模块默认情况下创建就自动注册。支持服务端渲染（`SSR`）。支持 `Vue DevTools`。更友好的代码分割机制

```vue
import { createPinia } from 'pinia';
app.use(createPinia())

import { defineStore } from 'pinia';
//id 是必填且需要唯一的
// options API模式
export const usePersonStore = defineStore('person',  {
state:()=>{
return
}
actions:{
}
getters:{
}
})
// setup模式
export const usePersonStore = defineStore('person',  ()=>{
const ......
return {
}
})
```

解构方法-storeToRefs，依旧是具备响应式的

# SPA

单页面应用，即客户端渲染，只有一个html文件,在vue中可以通过`vue-router`来局部切换组件,而非刷新整个页面,来实现无刷新切换页面的技术

hash原理：  js会感知到url的变化，通过这一点可以用js监听url中hash值的变化,通过onhashchange事件,由于哈希值的变换并不会引发页面的刷新和跳转,当监听到hash变化,就可以动态的切换组件,就可以实现无刷新切换页面技术

优点 页面每次切换跳转时只是单纯的组件和视图的切换，并不需要做html文件的请求，这样就节约了很多http发送时延，我们在切换页面的时候速度很快。
页面片段间的切换快，包括移动设备, 尤其是在网络环境差的时候, 因为组件已经预先加载好了, 并不需要发送网络请求, 所以用户体验好

缺点 首屏加载速度慢 不易于SEO  首屏时会把所有的页面用到的资源都加载一遍

seo 需要读取页面上的h1h2之类的。spa vue是基于js实时挂载到app上的，页面本质上是空的，不利于seo。ssr 代价大，全部转换    <div id="app"></div>

vue提供服务器端渲染技术(SSR)来解决

`MPA`多页面应用，多个html页面，每个页面必须重复加载js、css等相关资源。多页应用跳转，需要整页资源刷新。

# vue-router

前端路由 本质是监听 URL 的变化，然后匹配路由规则，在不刷新的情况下显示相应的页面。

### 路由规则  hash模式 

- 前端路由的路径用井号 # 拼接在真实 url 后面的模式，但是会覆盖锚点定位元素的功能，通过监听 URL 的哈希部分变化，相应地更新页面的内容。
- 前端路由的处理完全在客户端进行，在路由发生变化时，只会改变 URL 中的哈希部分(井号 # 后面的路径)，且不会向服务器发送新的请求，不会重新加载，而是触发 onhashchange 事件。
- hash 只有#符号之前的内容才会包含在请求中被发送到后端，如果 nginx 没有匹配得到当前的 url 也没关系。hash 永远不会提交到 server 端。
- hash值的改变，都会在浏览器的访问历史中增加一个记录，所以可以通过浏览器的回退、前进按钮控制hash的切换。
- hash 路由不会造成 404 页面的问题，因为所有路由信息都在客户端进行解析和处理，服务器只负责提供应用的初始 HTML 页面和静态资源，不需要关心路由的匹配问题。

- 通过location.hash修改hash值，触发更新。
- 通过监听hashchange事件监听浏览器前进或者后退，触发更新。

### history模式

浏览器在刷新页面时，会按照路径发送真实的资源请求。需要**服务端支持允许地址可访问**，如果 nginx 没有匹配得到当前的 url ，就会出现 404 的页面。

改变url： history 提供了 pushState 和 replaceState 两个方法来记录路由状态，这两个方法只改变 URL 不会引起页面刷新。

监听url变化：通过 onpopstate 事件监听history变化，在点击浏览器的前进或者后退功能时触发，在onpopstate 事件中根据状态信息加载对应的页面内容。

使用 history.pushState() 或 history.replaceState() 方法修改浏览器的历史记录时，不会直接触发 onpopstate 事件。但是，可以在调用这些方法时将数据存储在历史记录条目的状态对象中， onpopstate 事件在处理程序中访问该状态对象。这样，就可以在不触发 onpopstate 事件的情况下更新页面内容，并获取到相应的状态值。

**router-link：** 创建链接 其本质是`a`标签，这使得 Vue Router 可以在不重新加载页面的情况下更改 URL，处理 URL 的生成以及编码。

先 **router-view：**显示与 url 对应的组件。

**路由懒加载**(动态加载路由) component:() => **import**

### **`动态路由匹配本质上就是通过url进行传参`**

**`path`和`params`是不能同时生效的!**,否则params会被忽略掉

采用path:或者是name（唯一）加params

`query`是path和name都可以正常传参的,有没有path都可以进行传参

**params参数都不会显示在url地址栏中**.除了在路由中通过routes进行配置的.所以用户**刷新页面后,params参数就会丢失!**            /user/123

**query参数可以正常显示在url地址栏中**.刷新页面后也不会丢失    abc.com/products?category=phone&page=2

### 导航守卫

**全局守卫:**:异步执行

- router.beforeEach 全局前置守卫
- router.beforeResolve 全局解析守卫(2.5.0+) 在beforeRouteEnter调用之后调用.
- router.afterEach 全局后置钩子 进入路由之后 router.afterEach((to, from) => {});**注意:不支持next()**

**路由独享的守卫:** 路由对象独享

- beforeEnter:路由只独享这一个钩子,在routes里配置

**组件内的守卫:** 注意:这类路由钩子是写在组件内部的,

- beforeRouteEnter 进入路由前,此时实例还没创建,无法获取到this
- beforeRouteUpdate (2.2) 路由复用同一个组件时
- beforeRouteLeave 离开当前路由,此时可以用来保存数据,或数据初始化,或关闭定时器等等
- 图有错

![image-20240516222532469](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240516222532469.png)



静态标识变量通常用于标识某些值或状态是静态的，优化渲染过程，可用`<template v-once>`来创建静态







defineProps 只读，不能改 想改要再ref()

```
let emit=defineEmits(['geta'])
用emit('geta',函数参数)
```

父

```vue
<template>
    <ChildComponent :message="parentMessage" @childEvent="handleChildEvent" />
    <p>Message from child: {{ childMessage }}</p>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'
const parentMessage = ref('Hello from Parent!')
const childMessage = ref('')
function handleChildEvent(payload) {
  childMessage.value = payload
}
</script>
```

子

```vue
<template>
    <p>Message from parent: {{ message }}</p>
    <button @click="emit('childEvent', 'Hello from Child!')">Send Message to Parent</button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  message: String
})

const emit = defineEmits(['childEvent'])
</script>

```

# 样式隔离

style scoped  属性选择器 div[data-v-451232]
