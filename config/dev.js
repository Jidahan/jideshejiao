module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  h5: {},
  baseUrl: "https://jd.darling1314.com",
  rn: {
    publicPath: "/",
    devServer: {
      // host: 'localhost',
      // port: 10086,
      proxy: [
        {
          context: "['']",
          target: "https://jd.darling1314.com",
          changeOrigin: true,
          secure: false,
        },
      ],
    },
  },
};
