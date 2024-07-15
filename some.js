Array.prototype.mysome = function (fn) {
  for (let i = 0; i < this.length; ++i) {
    if (fn(this[i])) return true;
  }
  return false;
};
