function promiseall(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises))
      throw new Error("promises should be an array");
    let rescount = 0,
      resresult = [],
      prolen = promises.length;
    for (let i = 0; i < prolen; ++i) {
      promises[i].then(
        (val) => {
          rescount++;
          resresult[i] = val;
          if (prolen === rescount) resolve(resresult);
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
}
