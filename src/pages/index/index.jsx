import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import './index.less'

@connect(({ jihan }) => ({
  jihanData: jihan,   // 这里定义的值会传给页面的props
}))

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '9999'
    }
  }

  componentWillMount () {}
  
  componentDidMount () {
    this.props.dispatch({
      type: 'jihan/saveData', 
    }).then(() => {
      // dispatch方法可以.then 在数据更新之后再操作, 比如数据更新之后再跳转页面
      this.props.dispatch({
        type: 'jihan/editData',
        payload: 'hhh999988899998hh'
      }).then(() => {
        this.setState({ value: this.props.jihanData.jihan })
      })
    })
  }

  async UNSAFE_componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>{this.state.value}</Text>
        <Text>{JSON.stringify(this.props)}</Text>
        <Text>{this.props.jihanData.jihan}</Text>
      </View>
    )
  }
}

export default Index
  