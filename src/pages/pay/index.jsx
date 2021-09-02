import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { StyleSheet } from 'react-native'
import moment from 'moment';
import { WhiteSpace, Button, WingBlank, Card, Flex, Modal, Radio, Toast } from '@ant-design/react-native';
import wxImg from '../../images/wx.png';
import zfbImg from '../../images/zfb.png';
import adSumImg from '../../images/adSum.png'
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
            orderStatus: 2,
            orderSn: Date.now() + '',
            successTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            totalPrice: 100,
            transactionId: Date.now() + '',
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
              }else if(this.props.route.params.goodsType === '1'){
                Taro.eventCenter.trigger('payPhotoStatus', true)
              }else{
                Taro.eventCenter.trigger('payStatus', true)
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
        <View>
          <Card style={{ marginTop: -10 }}>
            <WingBlank size='lg'>
              <Card.Body>
                <View className='topContent'>
                  <Text style={{ color: '#202020', fontSize: 26, fontWeight: 'bold', padding: 30, paddingBottom: 18 }}>解锁Ta的社交账号</Text>
                  <Text style={{ fontSize: 16, color: '#f6386f' }}><Text style={styles.sumMoney}>100</Text>爱豆</Text>
                  <View style={styles.adText} >
                    <Image src={adSumImg} style={styles.adSumImg} />
                    <Text>100 = ¥200</Text>
                  </View>
                </View>
              </Card.Body>
            </WingBlank>
          </Card>
          
          <WhiteSpace size='lg' />
          <Card>
            <WingBlank size='lg'>
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
                    <Text style={{ marginLeft: 10, fontSize: 18 }}>支付宝支付</Text>
                  </View>
                </RadioItem>
              </Card.Body>
            </WingBlank>
          </Card>
          <WhiteSpace size='lg' />
        </View>
       
        <WingBlank>
          <Button type='primary' style={{ backgroundColor: '#F6386F', borderColor: '#ffffff', marginBottom: 30 }} className='pay' onPress={this.goPay}>去支付</Button>
        </WingBlank>
      </View>
    )
  }
}

export default Pay

const styles = StyleSheet.create({
  sumMoney: {
    fontFamily: 'PingFang SC',
    fontWeight: 'bold',
    color: '#F6386F',
    fontSize: 60
  },
  adSumImg: {
    width: 26,
    height: 26,
    marginRight: 5
  },
  adText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})