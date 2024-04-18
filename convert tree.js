function converttree(data) {
  let map = new Map(),
    tree = []; // 存储树形结构的数组 使用Map来存储节点及其子节点的关系
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
  { id: 1, pid: 0, name: "中国" }, // 数据数组，包含对象，表示id、父id和名称
  { id: 2, pid: 0, name: "巴铁" },
  { id: 3, pid: 1, name: "日本" },
  { id: 4, pid: 2, name: "美国" },
  { id: 5, pid: 2, name: "俄罗斯" },
  { id: 6, pid: 13, name: "乌克兰" }, // 注意：此处pid为13，没有对应的父节点
  { id: 7, pid: 3, name: "英国" },
  { id: 8, pid: 7, name: "意大利" },
  { id: 9, pid: 7, name: "西班牙" },
];
console.log(converttree(data));
