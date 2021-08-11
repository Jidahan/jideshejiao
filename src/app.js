import { Component } from 'react'
/* dva */
import { Provider } from 'react-redux'
import dva from './utils/dva'
import models from './models/index'
import AntRnProvider from './utils/antRnProvider'

import './app.less'

const dvaApp = dva.createApp( {
  initialState: {},
  models: models,
});

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