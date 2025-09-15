/**
 * 使用示例：带重复请求取消功能的axios实例
 */
import axiosinstance from './token.js';

// 示例1：快速连续发送相同请求，前一个请求会被自动取消
async function exampleDuplicateRequests() {
  console.log('示例1: 快速连续发送相同请求');
  
  // 发送第一个请求
  const request1 = axiosinstance.get('/api/data', { params: { id: 1 } });
  
  // 立即发送相同的请求（会取消第一个请求）
  const request2 = axiosinstance.get('/api/data', { params: { id: 1 } });
  
  try {
    const result = await request2;
    console.log('第二个请求成功:', result.data);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('请求被取消');
    } else {
      console.error('请求失败:', error);
    }
  }
  
  try {
    await request1;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('第一个请求被自动取消');
    }
  }
}

// 示例2：不同的请求不会互相取消
async function exampleDifferentRequests() {
  console.log('示例2: 不同的请求可以并发进行');
  
  const requests = [
    axiosinstance.get('/api/data', { params: { id: 1 } }),
    axiosinstance.get('/api/data', { params: { id: 2 } }),
    axiosinstance.post('/api/data', { name: 'test' })
  ];
  
  try {
    const results = await Promise.allSettled(requests);
    console.log('所有不同请求的结果:', results);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 示例3：搜索场景的实际应用
class SearchService {
  constructor() {
    this.axios = axiosinstance;
  }
  
  // 搜索方法，用户快速输入时会自动取消之前的搜索请求
  async search(keyword) {
    try {
      const response = await this.axios.get('/api/search', {
        params: { q: keyword }
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('搜索请求被新的搜索取消');
        return null;
      }
      throw error;
    }
  }
}

// 使用搜索服务
const searchService = new SearchService();

// 模拟用户快速输入
setTimeout(() => searchService.search('java'), 0);
setTimeout(() => searchService.search('javascript'), 100);  // 会取消上一个请求
setTimeout(() => searchService.search('javascript tutorial'), 200);  // 会取消上一个请求

// 示例4：页面切换时取消所有请求
function exampleCancelAllRequests() {
  console.log('示例4: 取消所有进行中的请求');
  
  // 发起多个请求
  axiosinstance.get('/api/data1');
  axiosinstance.get('/api/data2');
  axiosinstance.post('/api/data3', { name: 'test' });
  
  // 在页面切换或组件卸载时取消所有请求
  setTimeout(() => {
    console.log('取消所有进行中的请求...');
    axiosinstance.cancelAllPendingRequests();
  }, 500);
}

// React组件示例
class ApiComponent {
  componentWillUnmount() {
    // 组件卸载时取消所有请求，防止内存泄漏
    axiosinstance.cancelAllPendingRequests();
  }
  
  async fetchData() {
    try {
      const response = await axiosinstance.get('/api/data');
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('请求被取消，组件已卸载');
        return null;
      }
      throw error;
    }
  }
}

export { 
  exampleDuplicateRequests, 
  exampleDifferentRequests, 
  exampleCancelAllRequests,
  SearchService,
  ApiComponent 
};
