import { render, setArr, Element } from "./dom-vdom";

let allPatches,
  index = 0; // 默认哪个需要打补丁

function patch(node, patches) {
  allPatches = patches;
  //给某个元素打补丁
  doWalk(node);
}
function doWalk(node) {
  let current = allPatches[index++],
    childNodes = node.childNodes;
  // 先序深度，继续遍历递归子节点
  childNodes.forEach((child) => doWalk(child));
  if (current) {
    //对每个子节点递归调用doWalk
    doPatch(node, current);
  }
}
function doPatch(node, patches) {
  // 遍历所有打过的补丁
  patches.forEach((patch) => {
    switch (patch.type) {
      case "ATTR": //更新节点的属性
        for (let key in patch.attr) {
          let value = patch.attr[key];
          if (value) setArr(node, key, value);
          else node.removeAttribute(key);
        }
        break;
      case "TEXT": //更新节点的文本内容
        node.textContent = patch.textContent;
        break;
      case "REPLACE": //用新的节点替换当前节点
        let newNode = patch.newNode;
        newNode =
          newNode instanceof Element
            ? render(newNode)
            : document.createTextNode(newNode);
        node.parentNode.replaceChild(newNode, node);
        break;
      case "REMOVE": //删除当前节点
        node.parentNode.removeChild(node);
        break;
      default:
        break;
    }
  });
}
export default patch;
//https://juejin.cn/post/6844903806132568072
// import { createElement, render, renderDom } from './dom-vdom';
// // +++ 引入diff和patch方法
// import diff from './domdiff';
// import patch from './dompatch';
// // +++

// let virtualDom = createElement('ul', {class: 'list'}, [
//     createElement('li', {class: 'item'}, ['周杰伦']),
//     createElement('li', {class: 'item'}, ['林俊杰']),
//     createElement('li', {class: 'item'}, ['王力宏'])
// ]);

// let el = render(virtualDom);
// renderDom(el, window.root);

// // +++
// // 创建另一个新的虚拟DOM
// let virtualDom2 = createElement('ul', {class: 'list-group'}, [
//     createElement('li', {class: 'item active'}, ['七里香']),
//     createElement('li', {class: 'item'}, ['一千年以后']),
//     createElement('li', {class: 'item'}, ['需要人陪'])
// ]);
// // diff一下两个不同的虚拟DOM
// let patches = diff(virtualDom, virtualDom2);
// console.log(patches);
// // 将变化打补丁，更新到el
// patch(el, patches);
