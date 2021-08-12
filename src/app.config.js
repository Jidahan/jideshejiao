export default {
  pages: [
    'pages/index/index',
    'pages/focus/index',
    'pages/home/index',
    'pages/home/components/advicePage/index',
    'pages/home/components/personInfoPage/index',
    'pages/home/components/historyVisit/index',
    'pages/userInfo/index',
    'pages/photoLists/index',
    'pages/pay/index',
    'pages/login/index',
    'pages/login/components/genderPage/index',
    'pages/citySelect/index'
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
    navigationBarTitleText: '记得',
    navigationBarTextStyle: 'black'
  },
}
