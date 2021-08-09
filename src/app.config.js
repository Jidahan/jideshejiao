export default {
  pages: [
    'pages/index/index',
    'pages/focus/index',
    'pages/home/index',
  ],
  debug:true,
  tabBar:{
    color:'#eeeeee',
    selectedColor:'#f0a1a1',
    list:[
      {
        text:'首页',
        pagePath:'pages/index/index',
        iconPath:'images/tarbarIcon.png',
        selectedIconPath: 'images/tarbarSelectedIcon.png'
      },
      {
        text:'关注',
        pagePath:'pages/focus/index',
        iconPath:'images/tarbarIcon.png',
        selectedIconPath: 'images/tarbarSelectedIcon.png'
      },
      {
        text:'我的',
        pagePath:'pages/home/index',
        iconPath:'images/tarbarIcon.png',
        selectedIconPath: 'images/tarbarSelectedIcon.png'
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
