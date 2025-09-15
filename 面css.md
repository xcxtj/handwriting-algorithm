外部引用CSS  link 页面载入时同时加载  @import页面网页完全载入以后加载,只能加载css，兼容

alt属性用于image失败后替换

rem相对于根元素（\<html>）

margin 设置 {全部} {上下，左右} {上，左右，下} {上，右，下，左}

# 1 z-index什么情况下会失效？

元素position不是非static，开启了浮动，父元素为relative，父元素的层叠优先级比其他元素低

![image-20240517142414774](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240517142414774.png)

# 2 画三角形，扇形

三角 宽高为0，给三个方向相同border值和solid，一个有颜色两个transparent。（先整体赋值，最后给一个颜色也行）

```css
div {
    width: 0;
    height: 0;
    border-top: 50px solid red;
    border-right: 50px solid transparent;
    border-left: 50px solid transparent;
}
```

扇形 宽高为0，都给border值 solid transparent  都给border-radius，一个方向的border颜色

```css
div{
    border: 100px solid transparent;
    width: 0;
    height: 0;
    border-radius: 100px;
    border-top-color: red;
}
```



# 3动画

js的`setTimeout` 和 `setInterval` 两个 API 设定的时间和浏览器有偏差，无法与浏览器的绘制帧保持同步。宏任务放入异步队列，执行时间更晚。页面最小化未激活时没必要渲染，节流，减少dom操作 **与浏览器的绘制帧同步** 的原生 API `requestAnimationFrame`取代



transition过渡 

```css
transition: transform 1s ease-in 1s	
```

animation:xxx  动画

@keyframes xxx{}

transform变换位置，缩放，旋转

translate移动  开启gpu图层，硬件加速，不会脱离文档流

```css
transform:translate
```

# 4优先级

! important>内联>id>类 伪类 属性>标签 伪元素

伪类:hover :focus :nth-child(n) 伪元素::before  ::after  属性[type='radio'] [href=xxx]

# 5隐藏元素

- **display: none**：渲染树不会包含该渲染对象，不会在页面中占据位置，也不会响应绑定的监听事件。
- **visibility: hidden**（可继承）：元素在页面中仍占据空间，但是不会响应绑定的监听事件。
- **transform: scale(0,0)**：将元素缩放为 0。仍在页面中占据位置，但是不会响应绑定的监听事件。
- **opacity: 0**：将元素的透明度设置为 0。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
- **z-index: 负值**：来使其他元素遮盖住该元素。

# 6盒

ie/怪异box-sizing: border-box

标准box-sizing: content-box

![image-20250913182602885](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20250913182602885.png)

# 7c3

新选择器 :not(.input) border-radius text-shadow text-decoration transform gradient animation

# 8预处理器

**后处理器，** 如： `postCss`，给`css`属性添加浏览器私有前缀

less sass(scss改良) 将 CSS 赋予了动态语言的特性，**变量、嵌套、运算、混入(Mixin)、继承、颜色处理、函数**

```scss
$blue: #1875e7
@mixin bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
#menu a {
  color: #111;
  @include bordered;
}
@function double($n) {
  @return $n * 2;
}
#sidebar {
  width: double(5px);
}
```

- css-loader：导入 CSS 模块，对 CSS 代码进行编译处理；
- style-loader：创建style标签，把 CSS 内容写入标签。

# 9可视区域（懒加载） hand

```
img.offsetTop < window.innerHeight + document.body.scrollTop;
```

# 10两栏

```
1 左float left,设置width 右的marginleft为width，宽auto
2 左float left,设置width 右bfc（overflow）
3 父flex 左设置width 右flex1
4 父亲relative 左absolute 设置width 右的marginleft为width
```

# 11三栏 

中间最先加载渲染

```
1左右绝对定位，设置width 中间设置对应方向大小的margin的值。
2左右设置固定大小，中间flex:1
3左float left 右float right 都设宽 中间margin
```



```
圣杯
！！！html中标签顺序中左右
父padding左右和左右宽一样 overflow  三栏左浮动 
中width100% 
左relative marginleft-100% left为-自己宽  
右relative maginleft-自己（-100%也可以？） right-自己
```



```
双飞翼（center里面是中）
父overflow 三栏（左右center ）左浮动 center的width100% 
中margin左右和左右宽相同  左marginleft-100%  右marginleft-自己  
```

# 12居中

```
1absolute l50% r50% transform:translate(-50%,-50%)
2absolute lrtb都0 margin auto
3flex align-items和justify-content center
```

# 13flex

flex默认0 1 auto 放大，缩小，auto:初始大小基于其内容或宽高

flex：1; 1 1 0:初始主轴尺寸为 0

# 14float

控制元素在水平方向上的布局和定位。脱离标准文档流，它使元素能够向左或向右浮动，并允许其他内容环绕它   文字环绕图片

父容器的高度塌陷 清除浮动

1设置父元素的高度

2clear: both;{

在父元素结束之前添加一个空元素比如(div),伪元素 ：：after,给后面受影响的元素设置

}

3把父容器设置成 BFC 容器 overflow hidden

# 15bfc 块级格式化上下文

可以理解为一个独立容器

**BFC容器内部和外部的容器相互隔离，互不影响 -- 解决margin重叠问题**

**BFC容器在计算高度时，浮动元素也参与计算 --- 清除浮动**

- 根元素：body；
- 元素设置浮动：float 除 none 以外的值；
- 元素设置绝对定位：position (absolute、fixed)；
- display 值为：inline-block、table-cell、table-caption、flex等；
- overflow 值为：hidden、auto、scroll；

# 16定位

relative相对自身，absolute相对最近定位祖先，fixed window，sticky（relative和fixed之间）

# 17文档流

CSS 的文档流（Document Flow）是指文档中元素按照其在 HTML 中出现的顺序自上而下布局的方式，也称为常规流（Normal Flow）或默认流。文档流定义了元素的布局顺序和定位方式，包括元素的位置、大小、间距等属性。

# 深色模式

document.body.classlist.add("darkmode)





# SCSS

$变量

@mixin a($rad){}定义

@include a() 使用

@extend 继承

@if a>b{}  @else
