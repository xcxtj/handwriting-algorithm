import axios from "axios";
let deconfig = {
  baseURL: "http://localhost:3000",
  timeout: 5000,
};
class HTTP {
  constructor() {
    this.httpinterceptorrequest();
    this.httpinterceptorresponse();
  }
  private static axiosinstance = axios.create(deconfig);
  private httpinterceptorrequest() {
    HTTP.axiosinstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.token = token;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }
  private httpinterceptorresponse() {
    HTTP.axiosinstance.interceptors.response.use(
      (res) => {
        return res.data;
      },
      (err) => {
        //加上所有状态码
        return Promise.reject(err);
      }
    );
  }
  public httprequestget<T>(url, params): Promise<T> {
    return HTTP.axiosinstance
      .get(url, { params })
      .then((res) => res)
      .catch((err) => err);
  }
  public httprequestpost<T>(url, params): Promise<T> {
    return HTTP.axiosinstance
      .post(url, params)
      .then((res) => res)
      .catch((err) => err);
  }
}
export const http = new HTTP();
