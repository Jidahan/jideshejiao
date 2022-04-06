import Taro from "@tarojs/taro";

const baseUrl = "https://jd.darling1314.com";

export default (options = { method: "GET", data: {} }) => {
  console.log(
    `${new Date().toLocaleString()}【 URL=${
      baseUrl + options.url
    } 】DATA=${JSON.stringify(options.data)}`
  );
  return Taro.request({
    url: baseUrl + options.url,
    data: {
      ...options.data,
    },
    header: {
      "Content-Type": "application/json",
    },
    timeout: 60000,
    method: options.method.toUpperCase(),
    success: (result) => {
      const { data } = result;
      return data;
    },
    fail: (res) => {
      console.log("请求出错：", res);
      const { statusCode, data, errMsg } = res;
      if (statusCode >= 200 && statusCode < 300) {
        console.log(
          `${new Date().toLocaleString()}【 URL=${
            options.url
          } 】【接口响应：】`,
          res.data
        );
        if (data.msg !== "OK") {
          Taro.showToast({
            title: `${res.data.msg}~` || res.data.code,
            icon: "none",
            mask: true,
          });
        }
        return data;
      } else {
        Taro.clearStorage();
        Taro.redirectTo({
          url: "/pages/login/index",
        });
        throw new Error(
          errMsg === "request:fail timeout"
            ? "网络请求超时，请检查网络情况后重试"
            : `网络请求错误，状态码${statusCode}`
        );
      }
    },
    complete: (res) => {
      console.log("接口执行完成：", res);
      return res.data;
    },
  });
};
