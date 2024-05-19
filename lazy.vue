<template>
  <div></div>
  <img src="" data-src="http://127.0.0.1:5500/s" />
  <img src="" v-img-lazy="good.pic">
</template>

<script setup>
//1
const img = document.getElementsByTagName("img");
function fn() {
  let height = window.innerHeight || document.body.clientHeight;
  let scrolltop = document.body.scrollTop;
  if (height + scrolltop > img.offsetTop) {
    img[0].src = img[0].getAttribute("data-src");
  }
}
fn(); //可以加上防抖
//2
import { useIntersectionObserver } from "@vueuse/core";
export const lazyPlugin = {
  install(app) {
    // 懒加载指令逻辑
    app.directive("img-lazy", {
      mounted(el, binding) {
        // el: 指令绑定的那个元素 img
        // binding: binding.value  指令等于号后面绑定的表达式的值  图片url
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 进入视口区域
            el.src = binding.value;
            stop();
          }
        });
      },
    });
  },
};
//全局注册
// import {lazyPlugin}
// app.use(lazyPlugin)
</script>
