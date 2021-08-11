import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, CoverView, CoverImage, ScrollView, Image } from '@tarojs/components'
import { Icon, List, Button, WingBlank, Card, Flex, Modal, Radio, Toast } from '@ant-design/react-native'
import { BlurView } from "@react-native-community/blur";
import adImg from '../../images/ad.png'
import headImg from '../../images/1.png'
import manImg from '../../images/man.png'
import womenImg from '../../images/women.png'
import selectHeartImg from '../../images/selectHeart.png'
import goodActionImg from '../../images/goodAction.png'
import startImg from '../../images/start.png'
import photoImg from '../../images/photo.png'
import zwImg from '../../images/zw.png'
import './index.less';

const Item = List.Item;
const RadioItem = Radio.RadioItem;
class Userinfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgArray: [],
      evaluationModal: false,
      evalValue: 1,
      photoImgsModal: false,
    }
    this.goBack = this.goBack.bind(this)
    this.goMaPhoto = this.goMaPhoto.bind(this)
    this.spenMoneyLook = this.spenMoneyLook.bind(this)
    this.evaluation = this.evaluation.bind(this)
    this.unlock = this.unlock.bind(this)
    this.goLikeFunction = this.goLikeFunction.bind(this)
    this.handOkEvalSubmit = this.handOkEvalSubmit.bind(this)
    this.handOkPayPhotos = this.handOkPayPhotos.bind(this)
  }

  componentDidMount() {
    let imgArray = []
    for(let i = 1; i <= 10; i++) {
      imgArray.push({ id: i })
    }
    this.setState({ imgArray })
  }

  goBack() {
    Taro.navigateBack({
      delta: 1
    })
  }

  goMaPhoto() {
    this.setState({ photoImgsModal: true })
    // 跳转详情
    // Taro.navigateTo({
    //   url: '/pages/photoLists/index'
    // })
  }

  handOkPayPhotos() {
    Taro.navigateTo({
      url: '/pages/pay/index'
    })
  }

  spenMoneyLook() {
    console.log('解锁查看');
    Taro.navigateTo({
      url: '/pages/pay/index'
    })
  }

  evaluation() {
    console.log('评价');
    this.setState({ evaluationModal: true })
  }

  handOkEvalSubmit() {
    console.log(this.state.evalValue);
    const key = Toast.loading('加载中');
    setTimeout(() => {
      Toast.remove(key);
      Toast.success('评价成功！')
    }, 2000);
  }

  unlock() {
    console.log('解锁');
    Taro.navigateTo({
      url: '/pages/pay/index'
    })
  }

  goLikeFunction() {
    console.log('关注/不关注');
  }

  render() {
    const { imgArray, evaluationModal, photoImgsModal } = this.state
    const imgArrayHeight = imgArray.length <= 5 ? 80 : 140
    return (
      <View style={{ position: 'relative' }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f5f5f9', marginBottom: 20 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className='container'>
            <CoverView className='controls'>
              <CoverImage className='img' src={adImg} />
              <View className='rightTopImgAdd' onClick={this.goBack}>
                <Icon name='left' size='md' className='leftIconGoBack' />
              </View>
              <View className='imgArray'>
                <ScrollView
                  scrollX
                >
                  {imgArray.map(reward => {
                    return (
                      <View style={{width: 50, height: 50, marginLeft: 10}} className={reward.id === 0 ? 'selectImgArrayOneImg' : ''} key={reward.id}>
                        <Image
                          style={{width: '100%', height: '100%', borderRadius: 10}}
                          src={headImg}
                        />
                      </View>
                    )
                  })}
                </ScrollView>
              </View>
              <View className='bottomTwoText'>
                <Image src={womenImg} className='iconSizeStyle' style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 2 }}>她已通过女神认证</Text>
              </View>
              {/* <View className='bottomTwoText'>
                <Image src={manImg} className='iconSizeStyle' style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 2 }}>他已通过男神认证</Text>
              </View> */}
              <View className='bottomText'>
                <Icon name='alert' size='md' color='#efb336' />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>她已通过真人面容认证</Text>
              </View>
            </CoverView>
          </View>
          <List style={{ marginTop: 10 }}>
            <Item 
              arrow='' 
              thumb={null}
              extra={
                <View className='copyExtra' style={{ position: 'relative' }}>
                  <Image 
                    src={selectHeartImg} 
                    style={{width: 30, height: 30, position: 'absolute', right: 60, top: -15}}
                    onClick={this.goLikeFunction}
                  />
                  <Text style={{position: 'absolute', bottom: -8, right: 10, fontSize: 16}} onClick={this.goLikeFunction}>已关注</Text>
                </View>
              }
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 16 }}>柳岩</Text>
                <View style={{ marginLeft: 10 }}>
                  <Icon name='environment' size='md' style={{ color: '#d4237a' }} />
                </View>
                <Text style={{ color: '#8a8a8a', fontSize: 16 }}>110m 离线</Text>
              </View>
            </Item>

            <Item 
              arrow='' 
              thumb={null}
              extra={null}
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 16 }}>广州市</Text>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>18岁</Text>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>金牛座</Text>
              </View>
            </Item>

            <Item 
              arrow='' 
              thumb={null}
              extra={null}
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Image 
                  src={goodActionImg} 
                  style={{width: 28, height: 28}}
                />
                <Text style={{ marginLeft: 10, fontSize: 16 }}>好评 1</Text>
                <Image
                  src={startImg}
                  style={{width: 28, height: 28, marginLeft: 15}}
                />
                <Text style={{ marginLeft: 10, fontSize: 16 }}>爱豆 199</Text>
              </View>
            </Item>
            <WingBlank size='lg'>
              <Card>
                <Card.Header
                  title='她的相册'
                  thumbStyle={{ width: 30, height: 30 }}
                  thumb={
                    <Image src={photoImg} className='iconSizeStyle' />
                  }
                  extra={
                    <Item arrow='horizontal' 
                      onPress={this.goMaPhoto} 
                    >
                      <Text style={{ fontSize: 18, marginLeft: 60 }}>更多</Text>
                    </Item>
                  }
                />
                <Card.Body style={{ height: imgArrayHeight, overflow: 'hidden' }}>
                  <View style={{ height: 42, display: 'flex', flexDirection: 'row', marginTop: -5 }}>
                  <WingBlank>
                    <Flex wrap='wrap'>
                      {imgArray
                        .map((reward) => {
                          return (
                            <View>
                              <Image
                                style={{width: 60, height: 60, marginLeft: 5, borderRadius: 5, marginBottom: 10 }}
                                src={headImg}
                                key={reward.id}
                                className='filterImg'
                              />
                              <BlurView
                                className='absoluteBlurView'
                                blurType='light'
                                blurAmount={8}
                                reducedTransparencyFallbackColor='white'
                              />
                            </View>
                          )
                      })}
                    </Flex>
                  </WingBlank>
                  </View>
                </Card.Body>
              </Card>
              <Item
                thumb={null}
                disabled
                extra='160cm'
                arrow='empty'
              >
              身高
              </Item>
              <Item
                thumb={null}
                disabled
                extra='56kg'
                arrow='empty'
              >
              体重
              </Item>
              <Item
                thumb={null}
                extra='广州市'
                arrow='empty'
                disabled
              >
              常驻城市
              </Item>
              <Item
                thumb={null}
                // onPress={() => {}}
                extra={
                  <Text style={{ color: '#3b99fc' }} onClick={this.spenMoneyLook}>
                    解锁查看
                  </Text>
                }
                arrow='empty'
              >
              微信
              </Item>
            </WingBlank>
          </List>
        </ScrollView>
        <View className='bottomButton'>
          <Button type='primary' style={{ width: 150, backgroundColor: '#9409a8', borderColor: '#9409a8' }} onPress={this.evaluation}>评价</Button>
          <Button type='primary' style={{ width: 150, backgroundColor: '#2aa515', borderColor: '#2aa515' }} onPress={this.unlock}>解锁</Button>
        </View>

        <Modal
          title='评价'
          transparent
          onClose={() => {
            this.setState({ evaluationModal: false })
          }}
          maskClosable
          visible={evaluationModal}
          closable
          footer={[
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确定', onPress: this.handOkEvalSubmit },
          ]}
        >
          <View style={{ paddingVertical: 20 }}>
            <RadioItem
              checked={this.state.evalValue === 1}
              onChange={event => {
                if (event.target.checked) {
                  this.setState({ evalValue: 1 });
                }
              }}
            >
            好评
          </RadioItem>
          <RadioItem
            checked={this.state.evalValue === 2}
            onChange={event => {
              if (event.target.checked) {
                this.setState({ evalValue: 2 });
              }
            }}
          >
            一般
          </RadioItem>
          <RadioItem
            checked={this.state.evalValue === 3}
            onChange={event => {
              if (event.target.checked) {
                this.setState({ evalValue: 3 });
              }
            }}
          >
            差评
          </RadioItem>
          </View>
        </Modal>

        <Modal
          title=''
          transparent
          onClose={() => {
            this.setState({ photoImgsModal: false })
          }}
          maskClosable
          visible={photoImgsModal}
          closable
          footer={[
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '解锁相册', onPress: this.handOkPayPhotos },
          ]}
        >
          <View style={{ paddingVertical: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='layout' color='#3b99fc' style={{ fontSize: 40 }} />
            <Text style={{ fontSize: 20, marginTop: 20 }}>付费相册</Text>
            <Text style={{ marginTop: 20, marginBottom: 0 }}>有3张照片</Text>
          </View>
        </Modal>
      </View>
    )
  }
}

export default Userinfo
// 下面用来connect数据层
// export default connect(
//   ({
//     userInfo,
//   }) => ({
//     userInfo,
//   }),
// )(Userinfo);
