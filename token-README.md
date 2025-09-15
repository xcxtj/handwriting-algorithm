# Token.js - 带重复请求取消功能的Axios拦截器

## 功能特性

1. **自动token管理**: 自动添加Authorization头，401错误时自动刷新token
2. **防重复请求**: 自动识别并取消重复的请求
3. **请求队列管理**: token刷新期间的请求会被排队处理
4. **手动取消**: 支持手动取消所有进行中的请求

## 核心功能

### 1. 重复请求取消

当发起相同的请求时（相同的method、url、params、data），会自动取消之前进行中的请求：

```javascript
import axiosinstance from './token.js';

// 第一个请求会被自动取消
axiosinstance.get('/api/data', { params: { id: 1 } });
// 只有第二个请求会执行
axiosinstance.get('/api/data', { params: { id: 1 } });
```

### 2. 请求标识符生成

基于以下参数生成唯一标识符：
- HTTP方法 (GET, POST, etc.)
- 请求URL
- 查询参数 (params)
- 请求体数据 (data)

### 3. 手动取消所有请求

```javascript
// 取消所有进行中的请求
axiosinstance.cancelAllPendingRequests();
```

## 使用场景

### 1. 搜索功能
用户快速输入时，自动取消之前的搜索请求，只保留最新的搜索：

```javascript
class SearchService {
  async search(keyword) {
    try {
      const response = await axiosinstance.get('/api/search', {
        params: { q: keyword }
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return null; // 请求被取消
      }
      throw error;
    }
  }
}
```

### 2. 页面切换
在页面切换或组件卸载时取消所有请求，防止内存泄漏：

```javascript
// React组件示例
class MyComponent extends React.Component {
  componentWillUnmount() {
    axiosinstance.cancelAllPendingRequests();
  }
}

// Vue组件示例
export default {
  beforeDestroy() {
    axiosinstance.cancelAllPendingRequests();
  }
}
```

### 3. 防抖效果
无需额外的防抖逻辑，重复请求会被自动处理：

```javascript
// 用户快速点击按钮，只有最后一次点击的请求会被执行
button.addEventListener('click', () => {
  axiosinstance.post('/api/submit', formData);
});
```

## 错误处理

```javascript
try {
  const response = await axiosinstance.get('/api/data');
  console.log(response.data);
} catch (error) {
  if (axios.isCancel(error)) {
    console.log('请求被取消');
  } else {
    console.error('请求失败:', error);
  }
}
```

## 注意事项

1. **请求取消**: 被取消的请求会抛出 `axios.isCancel(error)` 为 `true` 的错误
2. **性能优化**: 避免了不必要的网络请求和服务器负载
3. **内存管理**: 及时清理请求控制器，防止内存泄漏
4. **兼容性**: 基于现代浏览器的 `AbortController` API

## 配置说明

```javascript
const axiosinstance = axios.create({
  baseURL: "https://api.openai.com/v1",
  timeout: 1000,  // 请求超时时间
});
```

可以根据实际需求调整 `baseURL` 和 `timeout` 等配置。
