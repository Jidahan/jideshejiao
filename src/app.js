import { Component } from 'react'
import Taro from '@tarojs/taro'
/* dva */
import { Provider } from 'react-redux'
import { Toast } from '@ant-design/react-native'
import dva from './utils/dva'
import models from './models/index'
import AntRnProvider from './utils/antRnProvider'

import './app.less'

const dvaApp = dva.createApp( {
  initialState: {},
  models: models,
});

Toast.config({
  duration: 1
})

Taro.setTabBarStyle({
  color: '#101010',
  selectedColor: '#FF5358',
  borderStyle: '#DCDCDC'
})


const store = dvaApp.getStore();
class App extends Component {

  componentDidMount () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return (
      <Provider store={store}>
        <AntRnProvider>
          {this.props.children}
        </AntRnProvider>
      </Provider>
    )
  }
}

export default App