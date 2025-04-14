const iteraObj = {
  data: [1, 2, 3, 4, 5], //{ a: 1, b: 2, c: 3 }
  index: 0,
  //keys: Object.keys(iteraObj.data),
  [Symbol.iterator]: function () {
    const _this = this;
    return {
      next: function () {
        if (_this.index < _this.data.length)
          //_this.keys.length
          //const key = _this.keys[_this.index++];
          //return { value: _this.data[key], done: false };
          return { value: _this.data[_this.index++], done: false };
        else return { done: true };
      },
    };
  },
};

for (let i of iteraObj) console.log(i);
