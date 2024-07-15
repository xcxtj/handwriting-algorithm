const iteraObj = {
  data: [1, 2, 3, 4, 5],
  index: 0,
  [Symbol.iterator]: function () {
    const _this = this;
    return {
      next: function () {
        if (_this.index < _this.data.length)
          return { value: _this.data[_this.index++], done: false };
        else return { done: true };
      },
    };
  },
};

for(let i of iteraObj)
console.log(i);