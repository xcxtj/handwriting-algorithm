// 在index.html中直接写WebSocket，设置服务端的端口号为 9999
let ws = new WebSocket('ws://localhost:9999');
// 在客户端与服务端建立连接后触发
ws.onopen = function () {
    console.log("Connection open.");
    ws.send('hello');
};
// 在服务端给客户端发来消息的时候触发
ws.onmessage = function (res) {
    console.log(res);       // 打印的是MessageEvent对象
    console.log(res.data);  // 打印的是收到的消息
};
// 在客户端与服务端建立关闭后触发
ws.onclose = function (evt) {
    console.log("Connection closed.");
};