import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { connect } from 'react-redux'
import { Button, Card, WhiteSpace, WingBlank, Modal,
  Toast,
  Provider, } from '@ant-design/react-native';

import './index.less'

@connect(({ jihan }) => ({
  jihanData: jihan,   // 这里定义的值会传给页面的props
}))

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '9999',
      visible: false,
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

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  async UNSAFE_componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const isShow = this.props.jihanData.twoData ? '' : 'none'
    const footerButtons = [
      { text: 'Cancel', onPress: () => console.log('cancel') },
      { text: 'Ok', onPress: () => console.log('ok') },
    ];
    return (
      <View className='index'>
        <Text>{this.state.value}</Text>
        <Text>{JSON.stringify(this.props)}</Text>
        <Text>{this.props.jihanData.jihan}</Text>
        <WingBlank size='lg'>
          <Button onPress={() => this.setState({ visible: true })}>
            showModal
          </Button>
        </WingBlank>
       
        <Provider>
          <Modal
            title='Title'
            transparent
            onClose={this.onClose}
            maskClosable
            visible={this.state.visible}
            closable
            footer={footerButtons}
          >
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
            </View>
            <Button type='primary' onPress={this.onClose}>
              close modal
            </Button>
          </Modal>

        </Provider>
       
        <Text style={{ display: isShow }}>隐藏/显示</Text>
        <Button type='primary' onPress={this.yincang}>隐藏/显示</Button>
        <WingBlank size='lg'>
          <Card>
            <Card.Header
              title='This is title'
              thumbStyle={{ width: 30, height: 30 }}
              thumb='https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg'
              extra='this is extra'
            />
            <Card.Body>
              <View style={{ height: 42 }}>
                <Text style={{ marginLeft: 16 }}>Card Content</Text>
              </View>
            </Card.Body>
            <Card.Footer
              content='footer content'
              extra='footer extra content'
            />
          </Card>
        </WingBlank>
        <WhiteSpace size='lg' />
        <Card full>
          <Card.Header
            title='Full Column'
            thumbStyle={{ width: 30, height: 30 }}
            thumb='https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg'
            extra='this is extra'
          />
          <Card.Body>
            <View style={{ height: 42 }}>
              <Text style={{ marginLeft: 16 }}>Card Content</Text>
            </View>
          </Card.Body>
          <Card.Footer content='footer content' extra='footer extra content' />
        </Card>
      </View>
    )
  }
}

export default Index
  