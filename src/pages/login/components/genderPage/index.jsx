import { Component } from 'react';
import Taro from '@tarojs/taro'
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Radio, List, Button, WingBlank, InputItem, Toast, Checkbox, Modal, WhiteSpace } from '@ant-design/react-native'

import womenno from '../../../../images/womenno.png'
import manno from '../../../../images/manno.png'
import womenyes from '../../../../images/womenyes.png'
import manyes from '../../../../images/manyes.png'
import gendersubmit from '../../../../images/gendersubmit.png'
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

  componentDidMount() {
    console.log(this.props);
  }

  genderSubmit() {
    this.setState({ deterModal: true })
  }

  okSubmit() {
    Taro.setStorage({
      key: "gender",
      data: this.state.genderValue
    }).then(() => {
      Taro.navigateTo({
        url: `/pages/beforeFace/index?userId=${this.props.route.params.userId}`
      })
    })
  }

  render() {
    return (
      <View className='gender-page'>
        <Image src={this.state.genderValue === 1 ? manyes : manno} onClick={() => { this.setState({ genderValue: 1 }) }} className='imgStyle' style={{ marginTop: 50 }} />
        <Image src={this.state.genderValue === 2 ? womenyes : womenno} onClick={() => { this.setState({ genderValue: 2 }) }} className='imgStyle' />
        <View style={{ alignItems: 'center', marginTop: 120 }}>
          <Image src={gendersubmit} onClick={this.genderSubmit} className='submitStyle' />
          <Text style={{ color: '#ACACAC', marginTop: 10 }}>* 性别一旦选定无法修改 *</Text>
        </View>
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
