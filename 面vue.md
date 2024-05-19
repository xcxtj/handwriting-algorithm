

# 响应式原理

```vue
let data ;let vm={}
Object.defineProperty(vm,data,{
get(){}
set(){}
})
```

```
let data= {
        name: '张三',
    }
let p=new Proxy(data,{
get(){}
set(){}
)
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

**Object.defineProperty** **直接修改原对象**

**Proxy 可以直接监听对象的所有key** ，proxy实现的过程是在目标对象之前设置了一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

### 嵌套代理

**Object.defineProperty**直接递归调用，通过给所有层级的所有key建立对于的 getter、setter

**Proxy 对于嵌套赋值，会触发 get，** **若获取的是 object 则返回 Proxy**， **等到触发了某个嵌套对象，才进行监听**

对于Object.defineProperty

1需要Observer的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter和getter 这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
		2Compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
		3Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
(1)在自身实例化时往属性订阅器(dep)里面添加自己
(2)自身必须有一个update()方法
(3)待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
		4MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。





Vue的响应式原理是Vue框架的核心特性之一，它确保了当数据模型发生变化时，视图会自动更新。这一机制主要依赖于JavaScript中的Object.defineProperty方法来实现。

以下是Vue响应式原理的详细解释：

### 1. 数据劫持（Data Hijacking）

当Vue实例被创建时，它的data对象中的所有属性都会被遍历。Vue通过Object.defineProperty对这些属性进行劫持（或称数据绑定），为每个属性创建一个getter和setter。

- **getter**：当读取数据时，getter会被触发，它会记录这个数据的依赖关系，即谁在读取这个数据。
- **setter**：当修改数据时，setter会被触发，它会通知所有依赖这个数据的变化的视图或组件，告诉它们数据已经发生了变化。

### 2. 依赖收集（Dependency Collection）

在组件渲染过程中，如果某个数据被读取，Vue会记录这个数据与当前组件的依赖关系。这一过程称为依赖收集。Vue通过一种叫做“依赖收集”的机制，将数据和视图建立起联系。

### 3. 发布-订阅模式（Publisher-Subscriber Pattern）

Vue的响应式系统采用了发布-订阅模式。每个组件实例都有一个watcher实例，它会在组件渲染的过程中被创建。当数据变动时，setter会通知所有订阅了该数据的watcher实例，然后这些watcher会调用它们的回调函数，促使视图更新。

### 4. 依赖通知与视图更新

当依赖的数据发生变化时，setter会通知之前收集到的所有依赖（即watcher），告诉它们数据已经改变。这些watcher会触发它们的回调函数，导致相关的视图重新渲染。

### 5. 异步更新队列

Vue的响应式系统实际上使用了异步更新队列，以提高性能。当数据变化时，Vue不会立即更新DOM，而是开启一个队列，并缓冲在同一个事件循环中发生的所有数据改变。如果同一个watcher被多次触发，只会被推入到队列中一次。这种去重和缓冲的机制意味着只有真正需要更新的视图才会被重新渲染，减少不必要的DOM操作。

通过这种方式，Vue的响应式系统确保了数据和视图之间的同步，并且提高了性能和效率。这种设计使得状态管理变得更加简单和直观，同时，由于不需要手动操作DOM，也大大提升了代码的可维护性和可读性。



# 事件循环

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

vdom是JS模拟的DOM结构，将DOM的比对操作放在JS层，减少浏览器不必要的重绘，提高效率。性能不是绝对更好

diff同层比较 O（n）

**sameVnode**

判断两个节点是否相同，并不是完全一毛一样，而是关键属性一样

```js
function sameVnode(a, b) {    
    return (
        //key 属性, tag 属性是否相等, 是否是input 节点
        //!! 是一个逻辑运算符，用于将值转换为布尔类型。data 属性是否都存在或都不存在,data可以不同
        a.key === b.key &&
        a.tag === b.tag &&
        !!a.data === !!b.data &&
        sameInputType(a, b)
    )
}
```

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

开始位置大于等于结束位置，说明所以节点都遍历过了，则结束循环，新的还有添加，旧的还有删除

```js
parentNode.removeChild(el);
    或者
    createElm(newCh[newStartIdx], parentElm, refElm//refElm 获取的是 newEndIdx 后一位的节点
    );
```

**vue3在diff算法中相比vue2增加了静态标记**, 其作用是为了**会发生变化的地方添加一个flag标记**，下次发生变化的时候直接找该地方进行比较,提高性能

# vue3的优化

Tree shaking 编译阶段利用ES6 Module判断哪些模块已经加载。判断那些模块和变量未被使用或者引用，进而删除对应代码

**Vue3中对不参与更新的元素，会做静态提升**，只会被提前创建一次，在渲染时直接复用。这样就免去了重复的创建节点，大型应用会受益于这个改动，免去了重复的创建操作，优化了运行时候的内存占用

vue2的Object.defineProperty： 检测不到对象属性的添加和删除，数组API方法无法监听到，需要对每个属性进行遍历监听，如果嵌套对象，需要深层监听，造成性能问题

Proxy 并不能监听到内部深层次的对象变化，而 Vue3 的处理方式是在 getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归

# axios

拦截器

请求拦截：[axios请求](https://so.csdn.net/so/search?q=axios请求&spm=1001.2101.3001.7020)拦截会先执行最后指定的回调函数，依次向前面执行，先进后出

响应拦截：axios响应拦截会先执行最先指定的回调函数，依次向后面执行，先进先出

Loading效果能很好的加强用户体验，避免重复请求,采用ElLoading   hand

**内部有个计数器，确保同一时刻如果有多个请求的话，不会同时出现多个 loading，而是只有 1 个。并且在所有请求结束后才会隐藏 loading**

封装



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

ESMoudle：export / export default 导出， import 进行导入，编译时确定依赖关系

遇到模块加载命令`import`时，不会去执行模块，而是只生成一个动态的只读引用。等到真的需要用到时，再到模块里面去取值

对于只读来说，即不允许修改引入变量的值，import的变量是只读的，不论是基本数据类型还是复杂数据类型。当模块遇到import命令时，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

对于动态来说，原始值发生变化，import加载的值也会发生变化。不论是基本数据类型还是复杂数据类型。

循环加载时，ES6模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行。



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

优化性能 压缩代码，cdn资源，tree shaking,code splitting

加速 缓存，缩小搜索范围include exclude，多线程thread-loader

hmr 要把该模块的相关依赖模块也全部编译一次



# 生命周期

**beforeCreate**在实例初始化之后、进行数据侦听和事件/侦听器的配置之前同步调用。**setup**()`setup` 函数会比 `beforeCreate` 与 `created` 先执行，记住它是入口，会最先跑。

**created**在实例创建完成后被立即同步调用，这个阶段挂载还没开始，所以 `$el` 还不能使用。**setup**()同上

**beforeMount**在挂载开始之前被调用，相关的 `render` 函数首次被调用，`$el` 依旧还不能用。**onBeforeMount**相同

**mounted**在实例挂载完成后被调用，这个时候 `$el` 能使用，但是这个阶段不能保证所有的子组件都挂载完成，如果你希望等待整个视图渲染完毕，可以使用 `$nextTick`。**onMounted**相同

**beforeUpdate**在数据发生改变后，DOM 被更新之前被调用（使用该钩子要注意死循环）。**onBeforeUpdate**相同

**updated**在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用（使用该钩子要注意死循环）。**onUpdated**相同

**beforeDestroy**实例销毁之前调用，但在这一步，实例仍然完全可用。**onBeforeUnmount**相同

**destroyed**实例销毁后调用，包括子实例也会被销毁。**onUnmounted**相同

# ref reactive 

**`ref` 是在 `reactive` 上在进行了封装**，增强了其能力，使它支持了对原始数据类型的处理

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

对于ref要手动开启深度监视，reactive默认深度

监视某个属性，写成函数式

手动停止watch，调用返回值 

```js
let st=watch(,()=>{}); st()
```

watchEffect立即执行 ` 不用明确指出监视的数据（函数中用到哪些属性，那就监视哪些属性）只要这些响应数据发生变化，就会触发 `watchEffect

# 组件通信

vue2和3对比：移出事件总线，使用`mitt`代替。vuex`换成了`pinia`。把`.sync`优化到了`v-model`里面了。把`$listeners`所有的东西，合并到`$attrs`中了。`$children`被砍掉了

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

`AtguiguInput`组件中：

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
  const emit = defineEmits(['update:abc'])
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







# pinia

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
const 
return {
}
})
```

解构方法-storeToRefs，依旧是具备响应式的

# SPA

单页面应用，即客户端渲染，只有一个html文件,在vue中可以通过`vue-router`来局部切换组件,而非刷新整个页面,来实现无刷新切换页面的技术

原理：  js会感知到url的变化，通过这一点可以用js监听url中hash值的变化,通过onhashchange事件,由于哈希值的变换并不会引发页面的刷新和跳转,当监听到hash变化,就可以动态的切换组件,就可以实现无刷新切换页面技术

优点 页面每次切换跳转时只是单纯的组件和视图的切换，并不需要做html文件的请求，这样就节约了很多http发送时延，我们在切换页面的时候速度很快。
     页面片段间的切换快，包括移动设备, 尤其是在网络环境差的时候, 因为组件已经预先加载好了, 并不需要发送网络请求, 所以用户体验好

缺点 首屏加载速度慢 不易于SEO  首屏时会把所有的页面用到的资源都加载一遍

vue提供服务器端渲染技术(SSR)来解决

`MPA`多页面应用，多个html页面，每个页面必须重复加载js、css等相关资源。多页应用跳转，需要整页资源刷新。

# vue-router

前端路由 本质是监听 URL 的变化，然后匹配路由规则，在不刷新的情况下显示相应的页面。

### 路由规则  hash模式 

- 前端路由的路径用井号 # 拼接在真实 url 后面的模式，但是会覆盖锚点定位元素的功能，通过监听 URL 的哈希部分变化，相应地更新页面的内容。
- 前端路由的处理完全在客户端进行，在路由发生变化时，只会改变 URL 中的哈希部分(井号 # 后面的路径)，且不会向服务器发送新的请求，而是触发 onhashchange 事件。
- hash 只有#符号之前的内容才会包含在请求中被发送到后端，如果 nginx 没有匹配得到当前的 url 也没关系。hash 永远不会提交到 server 端。
- hash值的改变，都会在浏览器的访问历史中增加一个记录，所以可以通过浏览器的回退、前进按钮控制hash的切换。
- hash 路由不会造成 404 页面的问题，因为所有路由信息都在客户端进行解析和处理，服务器只负责提供应用的初始 HTML 页面和静态资源，不需要关心路由的匹配问题。

- 通过location.hash修改hash值，触发更新。
- 通过监听hashchange事件监听浏览器前进或者后退，触发更新。

### history模式

浏览器在刷新页面时，会按照路径发送真实的资源请求。需要**通过服务端支持允许地址可访问**，如果 nginx 没有匹配得到当前的 url ，就会出现 404 的页面。

改变url： history 提供了 pushState 和 replaceState 两个方法来记录路由状态，这两个方法只改变 URL 不会引起页面刷新。

监听url变化：通过 onpopstate 事件监听history变化，在点击浏览器的前进或者后退功能时触发，在onpopstate 事件中根据状态信息加载对应的页面内容。

使用 history.pushState() 或 history.replaceState() 方法修改浏览器的历史记录时，不会直接触发 onpopstate 事件。但是，可以在调用这些方法时将数据存储在历史记录条目的状态对象中， onpopstate 事件在处理程序中访问该状态对象。这样，就可以在不触发 onpopstate 事件的情况下更新页面内容，并获取到相应的状态值。

**router-link：** 创建链接 其本质是`a`标签，这使得 Vue Router 可以在不重新加载页面的情况下更改 URL，处理 URL 的生成以及编码。

**router-view：**显示与 url 对应的组件。

**路由懒加载**(动态加载路由) component:() = **import**

### **`动态路由匹配本质上就是通过url进行传参`**

**`path`和`params`是不能同时生效的!**,否则params会被忽略掉

采用path:或者是name（唯一）加params

`query`是path和name都可以正常传参的,有没有path都可以进行传参

**params参数都不会显示在url地址栏中**.除了在路由中通过routes进行配置的.所以用户**刷新页面后,params参数就会丢失!**

 **query参数可以正常显示在url地址栏中**.刷新页面后也不会丢失

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

![image-20240516222532469](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240516222532469.png)



静态标识变量通常用于标识某些值或状态是静态的，优化渲染过程，可用`<template v-once>`来创建静态







defineProps 只读，不能改 想改要再ref()

```
let emit=defineEmits(['geta'])
用emit('geta',函数参数)
```

