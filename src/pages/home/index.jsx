import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

class Home extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello home!</Text>
      </View>
    )
  }
}

export default Home;