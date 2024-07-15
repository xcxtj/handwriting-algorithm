class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props; //元素的属性
    this.children = children;
  }
}
function createElement(type, props, children) {
  //工厂函数
  return new Element(type, props, children);
}

function render(domObj) {//虚拟DOM节点转换为真实的DOM元素
  let el = document.createElement(domObj.type); //创建一个新的DOM元素
  for (let key in domObj.props) {
    setArr(el, key, domObj.props[key]);
  }
  domObj.children.forEach((child) => {
    child =
      child instanceof Element ? render(child) : document.createTextNode(child);
    el.appendChild(child);
  });
  return el;
}

function setArr(node, key, value) {//根据类型 设置属性
  switch (key) {
    case "value":
      if (
        node.tagName.toLowerCase() === "input" ||
        node.tagName.toLowerCase() === "textarea"
      )
        node.value = value;
      else node.setAttribute(key, value);
      break;
    case "style":
      node.style.cssText = value;
      break;
    default:
      node.setAttribute(key, value);
      break;
  }
}
function renderDom(el, target) {//将构建好的虚拟DOM节点挂载到实际的DOM树中
  target.appendChild(el);
}
export { Element, createElement, render, renderDom, setArr };
