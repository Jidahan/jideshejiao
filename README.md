# 页面connect dva
export default connect(
  ({
    home,
  }) => ({
    home,
  }),
)(Index);

# 项目打包成rn npm script
$ yarn dev:rn // npm run dev:rn

这时，在浏览器输入 http://127.0.0.1:8081/index.bundle?platform=ios&dev=true 会触发对应终端平台的 js bundle 构建。

# 把应用放到空壳项目 (相关文章：https://github.com/NervJS/taro-native-shell/tree/0.63.2#readme)
git clone https://github.com/NervJS/taro-native-shell.git
cd taro-native-shell
yarn || npm install

工程目录如下：
➜  taro-native-shell git:(master) ✗ tree -L 1
.
├── LICENSE
├── README.md
├── android // Android 工程目录
├── ios // iOS 工程目录
├── node_modules
├── package.json
└── yarn.lock

cd ios
pod install 
yarn ios
iOS 模拟器会自行启动，并访问 8081 端口获取 js bundle





          {/* <View>
            <TextInput 
              type='text' 
              placeholder='输入昵称搜索' 
              focus 
              className='searchInput'
              keyboardType='web-search'
            />
          </View> */}

error: Unhandled JS Exception: Requiring unknown module “104”
solution: start==============
Ensure the module is installed by checking the folder node_modules/@highcharts/highcharts-react-native

If it is missing, install it with 
yarn add @highcharts/highcharts-react-native 
or 
npm install --save @highcharts/highcharts-react-native
Clear metro cache with watchman watch-del-all and rm -rf $TMPDIR/metro-bundler-cache-*

Restart the bundler resetting the cache with 
yarn start --reset-cache  // !import
or 
npm run start --reset-cache

Reload the bundle in your app (shake and press Restart on the menu)
solution: end==============

error: React native No Bundle URL present
solution: start==============
release 模式下，.jsbundle 文件也有，依然提示上面错误，此时你需要检查一下 Build Phases ->Coph Bundle Resources 种是否有包含.jsbundle
(png: https://upload-images.jianshu.io/upload_images/2115111-7dbe30d871a04c40.png)
solution: end==============


真机构建
taro build --type rn --platform ios  打包代码/编译代码 // taro官网

｜|
1. 首先在空壳项目（taro-native-shell）下面的 ios 目录新建 bundle 文件夹
2. 执行 react-native bundle --entry-file index.js --bundle-output ./ios/bundle/index.jsbundle --platform ios --assets-dest ./ios/bundle --dev false
3. bundle内assets可能会有缺失，自己根据情况进行替换
4. 打开xcode工程，把assest以及index.jsbundle拉到项目内
5. 更改AppDelegate.m内sourceURLForBridge的路径
6. 进行打包

