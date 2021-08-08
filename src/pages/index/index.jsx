import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import './index.less'

@connect(({ jihan }) => ({
  jihanData: jihan,   // 这里定义的值会传给页面的props
}))

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '9999',
    }
    this.yincang = this.yincang.bind(this)
  }

  componentWillMount () {}
  
  componentDidMount () {
    // dispatch方法可以.then 在数据更新之后再操作, 比如数据更新之后再跳转页面
    this.props.dispatch({
      type: 'jihan/saveData', 
    }).then(() => {
      this.setState({ value: this.props.jihanData.jihan })
    })
  }

  yincang() {
    this.props.dispatch({
      type: 'jihan/yincang', 
      payload: !this.props.jihanData.twoData
    })
  }

  async UNSAFE_componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const isShow = this.props.jihanData.twoData ? '' : 'none'
    return (
      <View className='index'>
        <Text>{this.state.value}</Text>
        <Text>{JSON.stringify(this.props)}</Text>
        <Text>{this.props.jihanData.jihan}</Text>
        <Text style={{ display: isShow }}>隐藏/显示</Text>
        <Button onClick={this.yincang}>隐藏/显示</Button>
        {/* <Icon size='60' type='success' />
        <View className='page-section'>
          <Text>默认样式</Text>
          <Checkbox value='选中'>选中</Checkbox>
          <Checkbox style='margin-left: 20px' value='未选中'>未选中</Checkbox>
        </View> */}
        {/* <View className='page-section'>
          <Text>推荐展示样式</Text>
          {this.state.list.map((item, i) => {
            return (
              <Label className='checkbox-list__label' for={i} key={i}>
                <Checkbox className='checkbox-list__checkbox' value={item.value} checked={item.checked} onChange={this.checkClick}>{item.text}</Checkbox>
              </Label>
            )
          })}
        </View> */}
      </View>
    )
  }
}

export default Index
  