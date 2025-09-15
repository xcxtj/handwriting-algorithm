/**
 * 带有自动token刷新和重复请求取消功能的axios实例
 * 功能特性：
 * 1. 自动添加Authorization头
 * 2. 401错误时自动刷新token
 * 3. 防止重复请求，自动取消前一个相同的请求
 */
import axios from "axios";
const axiosinstance = axios.create({
  baseURL: "https://api.openai.com/v1",
  timeout: 1000,
});
let isrefreshing = false;
let failedQueue = [];
// 用于管理重复请求的控制器
const pendingRequests = new Map();

// 生成请求的唯一标识符
function generateRequestKey(config) {
  const { method, url, params, data } = config;
  return `${method}_${url}_${JSON.stringify(params)}_${JSON.stringify(data)}`;
}

// 取消重复请求
function removePendingRequest(config) {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const abortController = pendingRequests.get(requestKey);
    abortController.abort();
    pendingRequests.delete(requestKey);
  }
}

// 添加请求到待处理列表
function addPendingRequest(config) {
  const requestKey = generateRequestKey(config);
  const abortController = new AbortController();
  config.signal = abortController.signal;
  pendingRequests.set(requestKey, abortController);
}

// 取消所有进行中的请求
function cancelAllPendingRequests() {
  pendingRequests.forEach((abortController) => {
    abortController.abort();
  });
  pendingRequests.clear();
}

axiosinstance.interceptors.request.use((config) => {
  // 取消相同的请求
  removePendingRequest(config);
  // 添加新的请求
  addPendingRequest(config);
  
  if (localStorage.getItem("token")) {
    config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
  }
  return config;
});
axiosinstance.interceptors.response.use(
  (success) => {
    // 请求成功后移除pending request
    removePendingRequest(success.config);
    return success;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是请求被取消，直接返回
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    
    // 请求失败后移除pending request
    removePendingRequest(originalRequest);
    
    // 检查是否为401错误且有token且未重试过
    if (
      error?.response?.status !== 401 ||
      originalRequest._retry ||
      !localStorage.getItem("token")
    ) {
      return Promise.reject(error); //都可以跳login
    }
    originalRequest._retry = true;
    if (!isrefreshing) {
      //上锁
      isrefreshing = true;
      try {
        const response = await axios.post("https://api.openai.com/v1/refresh", {
          token: localStorage.getItem("token"),
        }); //请求refresh token
        localStorage.setItem("token", response.data.token);
        failedQueue.forEach((cb) => cb());
        failedQueue = [];
        return axiosinstance(originalRequest); //重新发起原始请求
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isrefreshing = false;
      }
    } else {
      return new Promise((resolve, reject) => {
        failedQueue.push(() => {
          resolve(axiosinstance(originalRequest));
        });
      });
    }
  }
);

// 导出axios实例和取消所有请求的方法
axiosinstance.cancelAllPendingRequests = cancelAllPendingRequests;

export default axiosinstance;
