export default {
  pages: [
    'pages/index/index',
    'pages/focus/index',
    'pages/home/index',
    'pages/home/components/advicePage/index',
    'pages/home/components/personInfoPage/index',
    'pages/home/components/historyVisit/index',
    'pages/home/components/personInfoPage/components/editUserInfo',
    'pages/userInfo/index',
    'pages/photoLists/index',
    'pages/pay/index',
    'pages/login/components/genderPage/index',
    'pages/citySelect/index',
    'pages/login/index',
    'pages/adPage/index',
    'pages/beforeFace/index',
    'pages/face/index',
    'pages/lookPhotos/index',
  ],
  debug:true,
  tabBar:{
    color:'#242424',
    selectedColor:'#f0a1a1',
    list:[
      {
        text:'首页',
        pagePath:'pages/index/index',
        iconPath:'images/index.png',
        selectedIconPath: 'images/indexSelect.png'
      },
      {
        text:'关注',
        pagePath:'pages/focus/index',
        iconPath:'images/fouce.png',
        selectedIconPath: 'images/fouceSelect.png'
      },
      {
        text:'我的',
        pagePath:'pages/home/index',
        iconPath:'images/my.png',
        selectedIconPath: 'images/mySelect.png'
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
