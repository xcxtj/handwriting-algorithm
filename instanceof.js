function myinstance(l, r) {//a isntanceof b
  let proto = Object.getPrototypeOf(l),
    pro = r.prototype;
  while (true) {
    if (!proto) return false;
    if (proto === pro) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
