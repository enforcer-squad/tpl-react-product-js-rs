import axios from 'axios';

// 默认实例
const clientInstance = axios.create({
  baseURL: process.env.API_PATH,
  timeout: process.env.TIME_OUT,
  validateStatus: status => status < 500, // 配合后端小于500不算请求失败
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
clientInstance.interceptors.request.use(
  config =>
    // 根据情况自定义，如请求头发送token、展示loading
    config,
);

// 响应拦截器
clientInstance.interceptors.response.use(
  res => {
    // 根据情况做统一的错误处理，或后处理如隐藏loading
    // 把后端返回的完整数据抛出去
    return res.data?.data;
  },
  err =>
    // err.response.status 500情况
    Promise.reject(err),
);

const client = clientInstance.request;

export { client };
