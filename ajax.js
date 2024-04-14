const promise = new Promise((resolve, reject) => {
  const baseurl = "http://localhost:3000";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", baseurl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4)
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
