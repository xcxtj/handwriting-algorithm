function copy(obj) {
  if (!obj || typeof obj !== "object") return;
  let newobj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
		//浅newobj[key] = obj[key];
        //深拷贝 要递归copy
      newobj[key] = typeof obj[key] === "object" ? copy(obj[key]) : obj[key];
    }
  }
  return newobj;
}
Object.assign//只对对象最外层
JSON.parse(JSON.stringify())