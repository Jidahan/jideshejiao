import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { WhiteSpace, Button, WingBlank, Card, Flex, Modal, Radio, Toast } from '@ant-design/react-native';
import wxImg from '../../images/wx.png';
import zfbImg from '../../images/zfb.png';
import './index.less';
import {
  payCallBack,

} from './service'

const RadioItem = Radio.RadioItem;
class Pay extends Component {

  constructor(props) {
    super(props)
    this.state = {
      payStatus: 2
    }
    this.goPay = this.goPay.bind(this)
  }

  componentDidMount() {
    console.log(this.props);
  }

  goPay() {
    const key = Toast.loading('支付中...');
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          payCallBack({
            goodsType: this.props.route.params.goodsType,
            payType: this.state.payStatus,
            unlockUserId: this.props.route.params.userId,
            userId: res.data,
            tradeType: this.state.payStatus === 1 ? 'ali-SWEEPPAY' : 'wx-NATIVE',
            orderStatus: 2
          }).then(data => {
            if(data.data.status === 200) {
              Toast.remove(key);
              Toast.success({
                content: '支付成功！',
                duration: 1.5,
              })
              Taro.navigateBack({
                delta: 1,
              })
              if(this.props.route.params.goodsType === '2'){
                Taro.eventCenter.trigger('payWXStatus', true)
                setTimeout(() => {
                  Taro.eventCenter.trigger('payWXStatus', false)
                }, 10);
              }else if(this.props.route.params.goodsType === '1'){
                Taro.eventCenter.trigger('payPhotoStatus', true)
                setTimeout(() => {
                  Taro.eventCenter.trigger('payPhotoStatus', false)
                }, 10);
              }else{
                Taro.eventCenter.trigger('payStatus', true)
                setTimeout(() => {
                  Taro.eventCenter.trigger('payStatus', false)
                }, 10);
              }
            }else{
              Toast.remove(key);
              Toast.fail({
                content: '支付失败！',
                duration: 1.5,
              })
            }
          })
        }
      }
    })
  }

  render() {
    return (
      <View className='pay-page'>
        <Card>
          <WingBlank size='lg'>
            <Card.Body>
              <View className='topContent'>
                <Text style={{ color: '#8115a5', fontSize: 20, fontWeight: 'bold', padding: 30 }}>解锁她的社交号</Text>
                <Text style={{ fontSize: 16, padding: 10 }}>需付费查看：100爱豆/200元</Text>
              </View>
            </Card.Body>
          </WingBlank>
        </Card>
        
        <WhiteSpace size='lg' />
        <Card>
          <WingBlank size='lg'>
            <Card.Header
              title={
                <Text style={{ fontSize: 20, color: 'green', padding: 10, paddingLeft: 0}}>支付方式</Text>
              }
            />
            <Card.Body>
              <RadioItem
                checked={this.state.payStatus === 2}
                onChange={event => {
                  if (event.target.checked) {
                    this.setState({ payStatus: 2 });
                  }
                }}
              >
                <View className='payContentType'>
                  <Image 
                    src={wxImg}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text style={{ marginLeft: 10, fontSize: 18 }}>微信支付</Text>
                </View>
              </RadioItem>
              <RadioItem
                checked={this.state.payStatus === 1}
                onChange={event => {
                  if (event.target.checked) {
                    this.setState({ payStatus: 1 });
                  }
                }}
              >
                <View className='payContentType'>
                  <Image 
                    src={zfbImg}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text style={{ marginLeft: 10, fontSize: 18 }}>支付宝</Text>
                </View>
              </RadioItem>
            </Card.Body>
          </WingBlank>
        </Card>
        <WhiteSpace size='lg' />
        <WingBlank>
          <Button type='primary' style={{ backgroundColor: '#9409a8', borderColor: '#9409a8' }} onPress={this.goPay}>去支付</Button>
        </WingBlank>
      </View>
    )
  }
}

export default Pay
// 下面用来connect数据层
// export default connect(
//   ({
//     payPage,
//   }) => ({
//     payPage,
//   }),
// )(Paypage);
