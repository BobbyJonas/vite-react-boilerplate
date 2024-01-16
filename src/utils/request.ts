import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import qs from 'qs';
import _ from 'lodash';

import { message } from 'antd';

const BASE_URL = '/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

const stringyData = (data: any): string => {
  if (typeof data === 'object') return JSON.stringify(data);
  return String(data);
};

instance.defaults.paramsSerializer = (params: Record<string, any>) =>
  qs.stringify(params, { arrayFormat: 'repeat' });

instance.defaults.timeout = 20000;

instance.interceptors.request.use((request) => {
  const extraData = {};
  request.data = _.defaultsDeep(qs.parse(request.data) || {}, extraData);
  return request;
});

instance.interceptors.response.use(
  (res) => {
    if (res.data?.code !== 0) {
      message.error(
        `接口请求失败: ${res.data?.code ?? ''} ${res.data?.message ?? stringyData(res.data)}`
      );
      return Promise.reject(res.data);
    }
    return Promise.resolve(res);
  },
  (error: AxiosError) => {
    const { response } = error;
    if (response) {
      // 请求已发出，且服务器响应了状态码 (状态码非 2xx)
      switch (error.response?.status) {
        case 400: {
          break;
        }
        default:
          message.error(
            `接口请求失败: ${error.response?.status ?? ''} ${stringyData(error.response?.data)}`
          );
          return Promise.reject(error);
      }
    } else {
      // 1.请求已经成功发起，但没有收到响应 (此时可通过 error.request 处理)
      // 2.请求发出失败 (断网或超时)
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请稍后重试');
      } else if (error.code === 'ERR_BAD_RESPONSE') {
        message.error('网关错误，请联系管理员');
      } else {
        message.error(`接口请求失败: ${error.code ?? ''} ${stringyData(error.message)}`);
      }

      return Promise.reject(error);
    }
  }
);

export default instance;
export type { AxiosInstance, AxiosResponse };
