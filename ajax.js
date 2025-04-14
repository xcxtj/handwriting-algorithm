const promise = new Promise((resolve, reject) => {
  const baseurl = "http://localhost:3000";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", baseurl, true);//async：true（异步）或 false（同步）
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4)//0: 请求未初始化1: 服务器连接已建立2: 请求已接收3: 请求处理中4: 请求已完成，且响应已就绪
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        resolve(xhr.responseText);
      } else reject(xhr.statusText);
  };
  xhr.onerror = function () {
    reject(xhr.statusText);
  };
  xhr.responseType = "json";
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(null);
});
