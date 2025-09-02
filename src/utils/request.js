import axios from 'axios';
import router from '@/router';
import { getToken, removeToken } from './index';

const request = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000,
});

// 添加请求拦截器
request.interceptors.request.use((config) => {
  const token = getToken();
  config.headers.Authorization = `Bearer ${token || ''}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  if (error.response.status === 401) {
    removeToken();
    router.navigate('/login');
    // 有bug会黑屏，所以加上这一句
    window.location.reload();
  }
  return Promise.reject(error);
});

export { request };
