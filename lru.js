class Node {
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.pre = null;
  }
}
class LRUcache {
  constructor(capacity) {
    this.capacity = capacity;
    this.dummy = new Node();
    this.map = new Map();
    this.dummy.next = this.dummy;
    this.dummy.pre = this.dummy;
  }

  getnode(key) {
    if (!this.map.has(key)) return null;
    let node = this.map.get(key);
    this.remove(node);
    this.pushfront(node);
    return node;
  }
  get(key) {
    let node = this.getnode(key);
    return node == null ? -1 : node.value;
  }
  remove(node) {
    node.pre.next = node.next;
    node.next.pre = node.pre;
  }
  pushfront(node) {
    node.pre = this.dummy;
    node.next = this.dummy.next;
    node.pre.next = node;
    node.next.pre = node;
  }
  put(key, value) {
    let node = this.getnode(key);
    if (node) {
      node.value = value;
      return;
    }
    let newnode = new Node(key, value);
    this.map.set(key, newnode);
    this.pushfront(newnode);
    if (this.map.size > this.capacity) {
      let last = this.dummy.pre;
      this.map.delete(last.key);
      this.remove(last);
    }
  }
}
