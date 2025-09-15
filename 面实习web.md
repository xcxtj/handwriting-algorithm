# 多列同步滚动

```vue
<div 
      class="scroll-list left-list"
      ref="leftList"
      @scroll="handleScroll('left')"
    >
    isSyncing = true;
  
  if (source === 'left' && rightList.value) {
    // 左侧滚动时，同步到右侧
    rightList.value.scrollTop = leftList.value.scrollTop;
        isSyncing = false;

```

## vue卡片组件自动导入

import.meta.glob取出文件夹下所有.vue文件，for in命名方式转换，以配合jsname的格式。创建视图时，根据jsname查找，将:data传入，根据不同数据类型进行渲染。
