export default {
  pages: [
    'pages/index/index',
    'pages/home/index',
  ],
  debug:true,
  tabBar:{
    list:[
      {
        text:'首页',
        pagePath:'pages/index/index'
      },
      {
        text:'聊天',
        pagePath:'pages/home/index'
      },
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
