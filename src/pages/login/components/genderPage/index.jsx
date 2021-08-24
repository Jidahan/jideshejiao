import { Component } from 'react';
import Taro from '@tarojs/taro'
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Radio, List, Button, WingBlank, InputItem, Toast, Checkbox, Modal, WhiteSpace } from '@ant-design/react-native'

import { connect } from 'react-redux';

import adImg from '../../../../images/ad.png'
import admanImg from '../../../../images/adman.png'
import './index.less';

const RadioItem = Radio.RadioItem;

class Genderpage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      genderValue: 1,
      deterModal: false,
    }
    this.genderSubmit = this.genderSubmit.bind(this)
    this.okSubmit = this.okSubmit.bind(this)
  }

  componentDidMount() {}

  genderSubmit() {
    this.setState({ deterModal: true })
  }

  okSubmit() {
    Taro.setStorage({
      key: "gender",
      data: this.state.genderValue
    }).then(() => {
      Taro.navigateTo({
        url: '/pages/beforeFace/index'
      })
    })
  }

  render() {
    return (
      <View className='gender-page'>
        <WingBlank size='lg' style={{ width: '80%' }}>
          <List style={{ marginTop: 12 }}>
            <RadioItem
              checked={this.state.genderValue === 1}
              onChange={event => {
                if (event.target.checked) {
                  this.setState({ genderValue: 1 });
                }
              }}
            >
              <View>
                <Image src={admanImg} className={this.state.genderValue === 1 ? 'select' : ''} style={{ marginLeft: -10, height: 150 }} />
                <Text className='imgOnText'>精英男士</Text>
              </View>
            </RadioItem>
            <RadioItem
              checked={this.state.genderValue === 2}
              onChange={event => {
                if (event.target.checked) {
                  this.setState({ genderValue: 2 });
                }
              }}
            >
              <View>
                <Image src={adImg} className={this.state.genderValue === 2 ? 'select' : ''} style={{ marginLeft: -10, height: 150 }} />
                <Text className='imgOnText'>美丽女士</Text>
              </View>
            </RadioItem>
          </List>
          <WhiteSpace size='lg' />
          <Button type='primary' onPress={this.genderSubmit}>确定</Button>
        </WingBlank>
        <Modal
          title={null}
          transparent
          onClose={() => {
              this.setState({ deterModal: false })
            }}
          maskClosable
          visible={this.state.deterModal}
          footer={[
              { text: '取消', onPress: () => this.setState({ deterModal: false }) },
              { text: '确认', onPress: this.okSubmit },
            ]}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ textAlign: 'center' }}>注册后不能修改性别，确定吗？</Text>
          </View>
        </Modal>
      </View>
    )
  }
}

export default Genderpage
// 下面用来connect数据层
// export default connect(
//   ({
//     genderPage,
//   }) => ({
//     genderPage,
//   }),
// )(Genderpage);
