# 1 h5

语义化标签 header footer nav aside

媒体标签 audio video

表单 新类型url email date 属性placeholder required autocomplete

进度条 progress 

dom查询 querySelector querySelectorAll集合

web存储 storage

drag canvas svg

history API：go、forward、back、pushstate

# 2行内 块内

行内元素有：`a b span img input select strong`；

块内：**p div h1-6 ul li ol**

# 为什么js操作 DOM 慢

dom属于渲染引擎，js引擎和渲染引擎跨界交流依赖接口，开销大。

修改dom后重排重绘

# dom树转换

字节流》字符串》标记token》节点node》dom树

cssom同理 css匹配元素消耗性能，继承要少

render树中包含节点和样式（只有需要显示的） 比如识别display none

重排 计算位置和大小

重绘 

js操作css要有完整cssom，浏览器会先下载和构建CSSOM，然后再执行JavaScript，最后在继续构建DOM。阻塞dom解析
