import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

class Focus extends Component {

  UNSAFE_componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello Focus!</Text>
      </View>
    )
  }
}

export default Focus;