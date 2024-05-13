class Element {
  constructor(type, props, childrn) {
    this.type = type;
    this.props = props; //元素的属性
    this.childrn = childrn;
  }
}
function createElement(type, props, childrn) {
  //工厂函数
  return new Element(type, props, childrn);
}
function render(domObj) {
  let el = document.createElement(domObj.type); //创建一个新的DOM元素
  for (let key in domObj.props) {
    setArr(el, key, domObj.props[key]);
  }
  domObj.childrn.forEach((child) => {
    child =
      child instanceof Element ? render(child) : document.createNextNode(child);
    el.appendChild(child);
  });
  return el;
}
function setArr(node, key, value) {
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
function renderDom(el, target) {
  target.appendChild(el);
}
export { Element, createElement, render, renderDom, setArr };
