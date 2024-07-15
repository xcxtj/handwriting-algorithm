# http缓存

**强缓存**指的是只要浏览器判断缓存没有过期，则直接使用浏览器的本地缓存

响应头 Cache-Control（相对时间） 和 Expires （绝对时间），**Cache-Control 的优先级高于 Expires** 

浏览器再次请求资源时，会先**通过请求资源的时间与 Cache-Control 中设置的过期时间大小，来计算出该资源是否过期**

**协商缓存**就是与服务端协商之后，通过协商结果来判断是否使用本地缓存。

**只有在未能命中强制缓存的时候，才能发起带有协商缓存字段的请求**。

1 响应头部中的 `Last-Modified`，请求头部中的 `If-Modified-Since`

资源过期了，发现响应头中具有 Last-Modified 声明，则再次发起请求的时候带上 If-Modified-Since设为上次的 Last-Modified 的值的时间，服务器比较资源的最后修改时间

**无法识别一秒内进行多次修改的情况**，某些服务器**不能精确的得到文件最后修改时间**

2请求头部中的 `If-None-Match` 字段与响应头部中的 `ETag`

资源过期再次请求时，会将请求头 If-None-Match 值设置为上一次返回的 **Etag** 的值。服务器收到请求后进行比对本地的资源的 Etag 

**Etag 的优先级更高**

生成 ETag 值时，并*没有统一的算法规则*，而仅仅是由服务器来分配。分布式服务器系统，一模一样的一个文件的Etag值可能不一样。计算**性能损耗**



 **Cache-Control** **值**

| public   | 所有内容都将被缓存(客户端和代理服务器都可缓存)               |
| -------- | ------------------------------------------------------------ |
| private  | 内容只缓存到私有缓存中(仅客户端可以缓存，代理服务器不可缓存) |
| no-cache | 必须先与服务器确认，协商缓存                                 |
| no-store | 所有内容都不会被缓存                                         |

# 缓存 

### **cookie**

**HTTP 是无状态的协议（对于事务处理没有记忆能力** 

cookie名，值，过期时间，域，路径，缺一不可，必须都要有才能修改cookie，一旦创建成功，名称就无法修改

**maxAge**/expires  maxAge 秒后失效

secure 值为 true 时，在 HTTPS 中才有效

**httpOnly ，则无法通过 JS 脚本 读取到该 cookie 的信息**

```js
document.cookie = name + '=' + value + ';expires=' + expires + ';domain=' + domain + ';path=/';
expires 年月日类型 new date.toUTCString  删除 new date(1)
```

名字不能改  每个域名下Cookie的数量不能超过20个，大小<4kb，它是一种纯文本文件 无法跨域名,每次发起HTTP请求都会携带。子域可以**共享使用的**（**靠的是 domain）**

**移动端对 cookie 的支持不是很好**常用token

### session 

**基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的cookie 中**，**使服务端有状态化，可以记录会话信息**

也可放在url参数后面

第一次请求服务器的时候，服务器根据用户相关信息，创建对应的 Session,返回时将此唯一标识信息 SessionID 返回给浏览器。浏览器将SessionID 存入到 Cookie 中，同时 Cookie 记录此 SessionID 属于哪个域名。再次访问服务端会从 Cookie 中获取 SessionID， 查找对应的 Session 信息

关闭浏览器并不会删除服务器一个 session，是设置session失效时间，距离上一次访问超时后删除

Session 比 Cookie 安全，存在服务端，**存储大小**更大。Cookie 只支持存字符串，Session 任意。Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效。分布式要求session 数据共享（跨域问题）

### Token（令牌）

access token **访问资源接口（API）时所需要的资源凭证**

uid time sign(哈希)

密码验证成功后，服务端会签发一个 token 发给客户端。存在cookie 或者 localStorage。请求时携带token，**放到 HTTP 的 Header** ，服务端验证

**服务端无状态的认证方式，服务端不用存放 token 数据，不会存储会话信息** **用解析 token 的计算时间换取 session 的存储空间**可以跨域 查询数据库获取用户信息

refresh token 存在服务端

access token有效期比较短，过期后用 refresh token 去更新 access token，避免重输密码

**要用户数据和第三方共享，或者允许第三方调用 API 接口，用 Token**

### JSON Web Token（简称 JWT）跨域认证

```javascript
Header.Payload.Signature
```

Header元数据  json对象Base64URL 算法转成字符串

Payload实际需要传递的数据 json对象Base64URL 算法转成字符串

Signature对前两部分的签名，防止数据篡改

```
http请求头 Authorization: Bearer <token>
```

JWT 默认是不加密，也可以加

jwt内部包含了一些会话信息），因此减少了需要查询数据库，可以用于交换信息

跨域的时候，也可以把 JWT 放在 POST 请求的数据体里。

一旦 JWT 签发了，在到期之前就会始终有效。不能废止某个 token，或者更改 token 的权限

适合一次性的命令认证，采用有效期极短，每次操作都会生成新的 JWT

Token校验 时，还需要查询数据库获取用户信息

jwt服务端只需要使用密钥解密进行校验（校验也是 JWT 自己实现的）

### OAuth 2.0

授权机制，授权第三方应用进入系统获取数据，提供短期的进入令牌token

### 单点登录SSO

用户只需要登录一次就可以访问所有相互信任的应用系统

如何让 Session Id（或 Token）在多个域中共享

**1. 父域 Cookie**

Cookie 的 domain 属性设置为父域的域名（主域名）,path 属性设置为根路径。要求应用系统的域名需建立在一个共同的主域名之下

**2. 认证中心**

部署一个认证中心，认证中心就是一个专门负责处理登录请求的独立的 Web 服务

在认证中心登录成功后，认证中心记录用户的登录状态，并将 Token 写入 Cookie。（注意 Cookie 是认证中心的）

进入，应用系统检查当前请求有没有 Token，没有，跳转至认证中心进行登录。会带上认证中心的 Cookie ，认证中心判断是否登录。已经登录过了，跳转回目标 URL ，拼接一个生成的 Token，返回目标应用系统。

应用系统拿到 Token 之后，还需要向认证中心确认下 Token 的合法性。记录用户的登录状态，并将 Token 写入 Cookie（这个 Cookie 是当前应用系统的）再次访问当前应用系统时，就会自动带上这个 Token

**3. LocalStorage 跨域**

前后端分离的情况，将 Session Id （或 Token ）保存到浏览器的 LocalStorage。发送请求时，主动将 LocalStorage 的数据传递给服务端。登录成功后，将 Session Id （或 Token ）放在响应体中传递给前端。**几乎不需要后端参与**



localstorage和sessionstorage 同源，一般5mb

```
localStorage.setItem('key', 'value');
getItem('key');
removeItem('key');
clear();
.key(index)  valueOf()(全部数据)
```





# 1.0

非持久连接  expires ifmodifiedsince

# 1.1

持久连接，使多个http请求复用同一个tcp，减少建立连接时延 range域 etag ifnonematch

host域名  新增方法put options 报头必须文本 队头堵塞

# 2.0

二进制协议 帧 效率

多路复用 并发传输 在一个tcp连接里，客户端和服务器都可以同时发送多个请求或回应避免了http"队头堵塞"的问题 **不同 Stream 的帧**是不按顺序发送  streamid 

头信息压缩 头信息表，索引

服务器以stream推送必要的静态资源

**TCP 是字节流协议，必须保证收到的字节数据是完整且连续的「前 1 个字节数据」没有到达，一旦发生丢包后序缓冲区读不了**   **队头阻塞**

# 3.0

基于udp  quic协议  UDP 之上的**伪** TCP + TLS + HTTP/2 的多路复用的协议

快速握手1个rtt，集成tls加密，多路复用（**某个流发生丢包时，只会阻塞这个流**解决tcp队头阻塞），增加一层可靠性，重传，拥塞，连接迁移（wifi换流量） 之前ip（变，重新连接）加端口标记，现在连接id（有上下文，不变）



# https

端口443 SSL/tls加密传输协议

hash防篡改》对称加密（加密密钥）》非对称加密（防中间人）》数字证书（防篡改）》签名

签名：用一种hash对证书（公钥，hash算法，签发者）加密得到摘要，认证中心ca用私钥加密得到签名，发送数字证书（签名加原始信息）。浏览器用同样的hash得到摘要，用内置的公钥解密后对比。最后得到服务器的公钥

向CA查询证书是否有效



![image-20240520081311819](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240520081311819.png)

![image-20240520081338251](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240520081338251.png)

# DNS

**53号端口，同时使用TCP和UDP协议**  tcp区域传送，进行数据同步  域名解析udp        域名->ip

本地》根》 》顶级》 》权威》本地（缓存） 迭代

# OSI

应用 HTTP，HTTPS，FTP，POP3、SMTP

表示 base64

会话

传输 端到端 tcp udp

网络 路由 ip

数据链路 帧访问介质 mac

物理 

tcp/ip 应用（前3层）网络接口层（后2）

![image-20240605164832706](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240605164832706.png)

# udp

用户数据报 无连接 面向报文 多播 不可靠 开销小 不确认重传超时 不保证顺序

头部8字节

# tcp

传输控制协议 面向连接 单播 面向字节流 可靠 拥塞控制 全双工

头部20字节

慢启动（慢开始）翻倍
在开始发送的时候设置cwnd = 1，慢开始门限

拥塞避免  到ssthresh后，窗口加一

快速重传  三个重复确认ack

快速恢复  ssthresh门限减半，cwnd设置为ssthresh的大小，然后执行拥塞避免

![image-20240519225159527](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240519225159527.png)

同步连接双方的序列号和确认号

![image-20240519225346635](C:\Users\XTJ\AppData\Roaming\Typora\typora-user-images\image-20240519225346635.png)

粘包 延迟传送算法 (Nagle 算法), 在数据发送之前缓存他们. 如果短时间有多个数据发送, 会缓冲到⼀起作⼀次发送

# websocket

服务端可以主动推送消息 **全双工通讯** 基于TCP传输协议，并复用HTTP的握手通道

客户端向 WebSocket 服务器通知（notify）一个带有所有接收者ID（recipients IDs）的事件（event），服务器接收后立即通知所有活跃的（active）客户端，只有ID在接收者ID序列中的客户端才会处理这个事件。
