import axios from "axios";
const instance = axios.create({
  baseURL: "https://api.openai.com/v1",
  timeout: 1000,
});
let isrefreshing = false;
let failedQueue = [];
instance.interceptors.request.use((config) => {
  if (localStorage.getItem("token")) {
    config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
  }
  return config;
});
instance.interceptors.response.use(
  (success) => {
    return success;
  },
  async (error) => {
    const originalRequest = error.config;
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
        return instance(originalRequest); //重新请求原来的接口
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
          resolve(instance(originalRequest));
        });
      });
    }
  }
);
export default instance;
