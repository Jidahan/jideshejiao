import Taro from '@tarojs/taro';

const baseUrl = 'http://remember.dlztc.com'

export default (options = { method: 'GET', data: {} }) => {
  console.log(`${new Date().toLocaleString()}【 URL=${baseUrl + options.url} 】DATA=${JSON.stringify(options.data)}`);
  return Taro.request({
    url: baseUrl + options.url,
    data: {
      ...options.data
    },
    header: {
      'Content-Type': 'application/json',
    },
    method: options.method.toUpperCase(),
    success: (result) => {
      const { data } = result
      return data;
    },
    fail: (res => {
      // console.log('fail', res);
      const { statusCode, data } = res;
      if (statusCode >= 200 && statusCode < 300) {
        console.log(`${new Date().toLocaleString()}【 URL=${options.url} 】【接口响应：】`,res.data);
        if (data.msg !== 'OK') {
          Taro.showToast({
            title: `${res.data.msg}~` || res.data.code,
            icon: 'none',
            mask: true,
          });
        }
        return data;
      } else {
        throw new Error(`网络请求错误，状态码${statusCode}`);
      }
    }),
    complete: (res) => {
      // console.log('complete', res);
      return res.data
    },
  })
}