# 1 h5

语义化标签 header footer nav aside

媒体标签 audio video

表单 新类型url email date 属性placeholder required autocomplete

进度条 progress 

dom查询 querySelector querySelectorAll

web存储 storage

drag canvas svg

history API：go、forward、back、pushstate

# 2行内 块内

行内元素有：`a b span img input select strong`；

块内：p div h1-6 ul li ol

# 3Web Worker

与js主线程相互独立，可以在不影响主线程性能的情况下执行一些耗时操作而不会阻塞主线程，无法直接访问或操作DOM元素，创建多个独立线程，通过 postMessage 将结果回传到主线程

适合处理复杂任务和长时间运行的操作，计算密集型任务（耗时较长且对 CPU性能要求），异步操作