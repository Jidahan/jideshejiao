module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {},
  baseUrl: 'http://remember.dlztc.com',
  rn: {
    publicPath: '/',
    devServer: {
      // host: 'localhost',
      // port: 10086,
      proxy: [
        {
          context: "['']",
          target: "http://remember.dlztc.com",
          changeOrigin: true,
          secure: false
        }
      ]
    }
  }
}
