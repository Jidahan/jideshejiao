import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { StyleSheet } from 'react-native'
import * as WeChat from 'react-native-wechat-lib';
import moment from 'moment';
import { WhiteSpace, Button, WingBlank, Card, Flex, Modal, Radio, Toast } from '@ant-design/react-native';
import wxImg from '../../images/wx.png';
import zfbImg from '../../images/zfb.png';
import adSumImg from '../../images/adSum.png'
import './index.less';
import {
  payCallBack,
  createOrderPayByGoodsId,
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
    if(this.state.payStatus === 2) {
      WeChat.isWXAppInstalled()
      .then((isInstalled) => {
        console.log('wxIsInstall', isInstalled);
        if (isInstalled) {
          Taro.getStorage({
            key: 'userId',
            complete: (res) => {
              if (res.errMsg === "getStorage:ok") {
                createOrderPayByGoodsId({
                  goodsId: this.props.route.params.goodsType || '',
                  goodsType: this.props.route.params.goodsType || '',
                  payType: this.state.payStatus,
                  unlockUserId: this.props.route.params.userId,
                  userId: res.data,
                }).then(orderByIdData => {
                  console.log('后台api返回与支付订单相关信息', orderByIdData);
                  if(orderByIdData.statusCode === 200){
                    WeChat.pay({
                      partnerId: orderByIdData.data.data.mch_id,  // 商家向财付通申请的商家id
                      prepayId: orderByIdData.data.data.prepay_id,   // 预支付订单
                      nonceStr: orderByIdData.data.data.nonce_str,   // 随机串，防重发
                      timeStamp: orderByIdData.data.data.timeStamp,  // 时间戳，防重发.
                      package: 'Sign=WXPay',    // 商家根据财付通文档填写的数据和签名
                      sign: 'MD5'   // 商家根据微信开放平台文档对数据做的签名
                    }).then((requestJson)=>{
                      console.log('支付回调', requestJson);
                      //支付成功回调
                      if (requestJson.errCode === 0){
                        console.log('支付成功');
                        //回调成功处理
                        const orderByIdDataChild = orderByIdData.data.data
                        payCallBack({
                          orderSn: orderByIdDataChild.orderSn,
                          orderStatus: 2,
                          tradeType: this.state.payStatus === 1 ? 'ali-SWEEPPAY' : 'wx-NATIVE',
                          totalPrice: 100,
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
                              content: data.data.msg,
                              duration: 1.5,
                            })
                          }
                        }).catch(error => {
                          Toast.remove(key)
                          Toast.fail({
                            content: `遇到了错误${error}`,
                            duration: 2
                          })
                        })
                      }
                    }).catch((err)=>{
                      console.log('支付失败', err);
                      Toast.remove(key)
                      Toast.fail({
                        content: `支付失败`,
                        duration: 2
                      })
                    })
                    
                    
                  }else{
                    Toast.remove(key)
                    Toast.fail({
                      content: orderByIdData.data.msg || '生成订单失败',
                      duration: 1.5
                    })
                  }
                }).catch(error => {
                  Toast.remove(key)
                  Toast.fail({
                    content: `遇到了错误${error}`,
                    duration: 2
                  })
                })
              }
            }
          })
        } else {
          Toast.remove(key)
          Toast.fail({
            content: '您还没有安装微信，请安装微信之后再试',
            duration: 1.5
          })
        }
      });
    }else{
      Toast.remove(key)
      Toast.fail({
        content: '目前仅支持微信支付，请选用微信支付！',
        duration: 1.5
      })
    }
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