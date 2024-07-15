function converttree(data) {
  let map = new Map(),
    tree = []; // 存储树形结构的数组 使用Map来存储节点及其子节点的关系
  for (let i of data) map.set(i.id, i); // 第一次遍历：创建所有节点的映射
  for (let i = 0; i < data.length; i++) {
    let pid = data[i].pid;
    if (map.has(pid)) {
      // 如果map中已经有了对应的父节点
      if (!map.get(pid).children)
        // 如果父节点没有子节点数组，则创建一个
        map.get(pid).children = [];
      let obj = new Object(data[i]); // 创建当前对象的副本
      map.get(pid).children.push(obj); // 将副本添加为父节点的子节点
      map.set(data[i].id, obj); // 在map中保存当前节点
    } else {
      let outobj = new Object(data[i]);
      tree.push(outobj); // 将副本添加到树形结构数组中
      map.set(data[i].id, outobj);
    }
  }
  return tree;
}

let data = [
  { id: 3, pid: 1, name: "樱桃" },
  { id: 1, pid: 0, name: "西瓜" },
  { id: 2, pid: 0, name: "芒果" },
  { id: 4, pid: 2, name: "苹果" },
  { id: 5, pid: 2, name: "猕猴桃" },
  { id: 6, pid: 13, name: "草莓" },
  { id: 7, pid: 3, name: "香蕉" },
  { id: 8, pid: 7, name: "橙子" },
  { id: 9, pid: 7, name: "葡萄" },
];
const list = [
  {
    id: 19,
    pid: 0,
  },
  {
    id: 14,
    pid: 16,
  },
  {
    id: 17,
    pid: 14,
  },
  {
    id: 16,
    pid: 0,
  },
];
console.log(converttree(data));
console.log(converttree(list));
const arr = [{
  id: 0,
  data: 1,
}, {
  pid: 0,
  id: 1,
  data: 2,
}, {
  pid: 0,
  id: 2,
  data: 3,
}, {
  pid: 2,
  id: 3,
  data: 4,
}, {
  pid: 3,
  id: 4,
  data: 5,
}]
console.log(converttree(arr));