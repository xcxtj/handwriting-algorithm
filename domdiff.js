function diff(oldTree, newTree) {
  // 声明变量patches用来存放补丁的对象
  let patches = {};
  // 第一次比较应该是树的第0个索引
  let index = 0;
  // 递归树 比较后的结果放到补丁里
  walk(oldTree, newTree, index, patches);
  return patches;
}
function walk(oldNode, newNode, index, patches) {
  //index跟踪当前正在比较的节点在其父节点子节点数组中的位置
  // 每个元素都有一个补丁
  let current = [];

  if (!newNode) {
    // 新的DOM节点不存在{type: 'REMOVE', index}
    current.push({ type: "REMOVE", index });
  } else if (typeof oldNode === "string" && typeof newNode === "string") {
    // 判断文本是否一致
    if (oldNode !== newNode) {
      current.push({ type: "TEXT", text: newNode });
    }
  } else if (oldNode.type === newNode.type) {
    //新老节点的类型相同
    // 比较属性是否有更改
    let attr = diffAttr(oldNode.props, newNode.props);
    if (Object.keys(attr).length > 0) {
      current.push({ type: "ATTR", attr });
    }
    // 如果有子节点，遍历子节点
    diffChildren(oldNode.children, newNode.children, patches);
  } else {
    // 说明节点被替换了
    current.push({ type: "REPLACE", newNode });
  }

  // 当前元素确实有补丁存在
  if (current.length) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = current;
  }
}

function diffAttr(oldAttrs, newAttrs) {
  //比较两个节点的属性差异。通过两次遍历，比较旧属性和新属性的差异，并将差异存储在patch对象中
  let patch = {}; //存储属性的差异
  // 判断老的属性中和新的属性的关系
  for (let key in oldAttrs)
    if (oldAttrs[key] !== newAttrs[key]) patch[key] = newAttrs[key]; // 有可能还是undefined

  // 老节点没有新节点的属性
  for (let key in newAttrs)
    if (!oldAttrs.hasOwnProperty(key)) patch[key] = newAttrs[key];
  return patch;
}
// 所有都基于一个序号来实现
let num = 0;

function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++num, patches);
  });
}
export default diff;
