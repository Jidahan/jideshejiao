import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, CoverView, CoverImage, ScrollView, Image, Video } from '@tarojs/components'
import { Icon, List, Button, WingBlank, Card, Flex, Modal, Radio, Toast } from '@ant-design/react-native'
import { BlurView } from "@react-native-community/blur";
import Clipboard from '@react-native-clipboard/clipboard'
import manImg from '../../images/man.png'
import womenImg from '../../images/women.png'
import selectHeartImg from '../../images/selectHeart.png'
import goodActionImg from '../../images/goodAction.png'
import startImg from '../../images/start.png'
import photoImg from '../../images/photo.png'
import heartImg from '../../images/heart.png'
import './index.less';
import {
  appUserDetail,
  evaluateUsers,
  collectionUser,
} from './service';


const Item = List.Item;
const RadioItem = Radio.RadioItem;
class Userinfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      evaluationModal: false,
      evalValue: 1,
      photoImgsModal: false,
      userId: '',
      userInfo: '',
      selectSmallImg: '',
    }
    this.goBack = this.goBack.bind(this)
    this.goMaPhoto = this.goMaPhoto.bind(this)
    this.spenMoneyLook = this.spenMoneyLook.bind(this)
    this.evaluation = this.evaluation.bind(this)
    this.unlock = this.unlock.bind(this)
    this.goLikeFunction = this.goLikeFunction.bind(this)
    this.handOkEvalSubmit = this.handOkEvalSubmit.bind(this)
    this.handOkPayPhotos = this.handOkPayPhotos.bind(this)
    this.selectSmallImg = this.selectSmallImg.bind(this)
    this.copyWx = this.copyWx.bind(this)
  }

  componentDidMount() {
    this.setState({ userId: this.props.route.params.id })
    this.getUserInfo()
  }

  getUserInfo() {
    const key = Toast.loading('加载中...');
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          appUserDetail({
            userId: res.data,
            otherUserId: this.props.route.params.id,
          }).then(data => {
            if(data.data.status === 200){
              Toast.remove(key);
              this.setState({ userInfo: data.data.data })
            }else{
              Toast.remove(key);
              Toast.fail(data.data.data)
            }
          })
        }
      }
    })
   
  }

  goBack() {
    Taro.navigateBack({
      delta: 1
    })
  }

  goMaPhoto() {
    const { userInfo:{unlockPhotos} } = this.state
    if(unlockPhotos === 1) {
      // 跳转详情
      Taro.navigateTo({
        url: '/pages/photoLists/index'
      })
    }else{
      this.setState({ photoImgsModal: true })
    }
  }

  handOkPayPhotos() {
    Taro.navigateTo({
      url: `/pages/pay/index?goodsType=1&userId=${this.state.userId}`
    })
    Taro.eventCenter.on('payPhotoStatus',(arg)=>{
      if(arg){
        this.getUserInfo()
      }
    })
  }

  spenMoneyLook() {
    Taro.navigateTo({
      url: `/pages/pay/index?goodsType=2&userId=${this.state.userId}`
    })
    Taro.eventCenter.on('payWXStatus',(arg)=>{
      if(arg){
        this.getUserInfo()
      }
    })
  }

  evaluation() {
    console.log('评价');
    this.setState({ evaluationModal: true })
  }

  handOkEvalSubmit() {
    const key = Toast.loading('加载中');
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          evaluateUsers({ evaluatedUserId: this.state.userId, ratingLevel: this.state.evalValue, userId: res.data }).then(data => {
            console.log(data);
            if(data.data.status === 200){
              Toast.remove(key);
              Toast.success('评价成功！')
              this.getUserInfo()
            }else{
              Toast.remove(key);
              Toast.fail(data.data.msg)
            }
          })
        }
      }
    })
  }

  selectSmallImg(reward) {
    console.log(reward);
    this.setState({ selectSmallImg: reward })
  }

  unlock() {
    console.log('解锁');
    Taro.navigateTo({
      url: `/pages/pay/index?userId=${this.state.userId}`,
    })
    Taro.eventCenter.on('payStatus',(arg)=>{
      if(arg){
        this.getUserInfo()
      }
    })
  }

  goLikeFunction() {
    console.log('关注/不关注');
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          const key = Toast.loading('')
          collectionUser({otherUserId: this.state.userId, userId: Number(res.data)}).then(data => {
            if(data.data.status === 200){
              Toast.remove(key)
              Toast.success(data.data.data)
              this.getUserInfo()
            }else{
              Toast.remove(key)
              Toast.fail(data.data.msg)
            }
          })
        } else {
          console.log('获取存储数据失败');
        }
      }
    })
  }

  copyWx() {
    const { userInfo:{wxAccount} } = this.state
    Clipboard.setString(wxAccount)
    Toast.success({
      content: '已复制',
      duration: 0.5,
      mask: true,
      stackable: false,
    });
  }

  render() {
    const { evaluationModal, photoImgsModal, userInfo, selectSmallImg } = this.state
    const imgArrayHeight = userInfo?.photos?.length <= 5 ? 80 : 140
    // const threePhoto = 
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
              <CoverImage className='img' src={selectSmallImg || userInfo.photo} />
              <View className='rightTopImgAdd' onClick={this.goBack}>
                <Icon name='left' size='md' className='leftIconGoBack' />
              </View>
              <View className='imgArray'>
                <ScrollView
                  scrollX
                >
                  {userInfo?.photos?.map(reward => {
                    if(reward.url.indexOf('mp4') === -1){
                      return (
                        <View style={{width: 60, height: 60, marginLeft: 10}} className={reward === this.state.selectSmallImg ? 'selectImgArrayOneImg' : ''} key={reward.id} onClick={() => this.selectSmallImg(reward)}>
                          <Image
                            style={{width: '100%', height: '100%', borderRadius: 10}}
                            src={reward?reward:null}
                          />
                        </View>
                      )
                    }
                  })}
                </ScrollView>
              </View>
              {
                userInfo.gender === 2 ?
                <View className='bottomTwoText'>
                  <Image src={womenImg || null} className='iconSizeStyle' style={{ width: 20, height: 20 }} />
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 2 }}>她已通过女神认证</Text>
                </View>
                :
                <View className='bottomTwoText'>
                  <Image src={manImg || null} className='iconSizeStyle' style={{ width: 20, height: 20 }} />
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 2 }}>他已通过男神认证</Text>
                </View>
              }
              {
                userInfo.gender === 2 ?
                  userInfo.personAuthentication === 1 ?
                  <View className='bottomText'>
                    <Icon name='alert' size='md' color='#efb336' />
                    <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>她已通过真人面容认证</Text>
                  </View>
                  :
                  <View className='bottomText'>
                    <Icon name='alert' size='md' color='#efb336' />
                    <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>她暂时还未通过真人面容认证</Text>
                  </View>
                :
                userInfo.personAuthentication === 1 ?
                <View className='bottomText'>
                  <Icon name='alert' size='md' color='#efb336' />
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>他已通过真人面容认证</Text>
                </View>
                :
                <View className='bottomText'>
                  <Icon name='alert' size='md' color='#efb336' />
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>他暂时还未通过真人面容认证</Text>
                </View>
              }
              
            
            </CoverView>
          </View>
          <List style={{ marginTop: 10 }}>
            <Item 
              arrow='' 
              thumb={null}
              extra={
                userInfo.collectionIs === 1 ? 
                  <View className='copyExtra' style={{ position: 'relative' }}>
                    <Image 
                      src={selectHeartImg} 
                      style={{width: 30, height: 30, position: 'absolute', right: 60, top: -15}}
                      onClick={this.goLikeFunction}
                    />
                    <Text style={{position: 'absolute', bottom: -8, right: 10, fontSize: 16}} onClick={this.goLikeFunction}>已关注</Text>
                  </View>
                :
                <View className='copyExtra' style={{ position: 'relative' }}>
                  <Image 
                    src={heartImg} 
                    style={{width: 30, height: 30, position: 'absolute', right: 45, top: -15}}
                    onClick={this.goLikeFunction}
                  />
                  <Text style={{position: 'absolute', bottom: -8, right: 10, fontSize: 16}} onClick={this.goLikeFunction}>关注</Text>
                </View>
              }
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 16 }}>{userInfo.nickName}</Text>
                <View style={{ marginLeft: 10 }}>
                  <Icon name='environment' size='md' style={{ color: '#d4237a' }} />
                </View>
                <Text style={{ color: '#8a8a8a', fontSize: 16 }}>{userInfo.distance} {userInfo.onlineState === 1 ? '在线' : '离线'}</Text>
              </View>
            </Item>

            <Item 
              arrow='' 
              thumb={null}
              extra={null}
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 16 }}>{userInfo.city}</Text>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>{userInfo.age}岁</Text>
                <Text style={{ marginLeft: 10, fontSize: 16 }}>{userInfo.constellation}</Text>
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
                <Text style={{ marginLeft: 10, fontSize: 16 }}>好评 {userInfo.praiseNum}</Text>
                <Image
                  src={startImg}
                  style={{width: 28, height: 28, marginLeft: 15}}
                />
                <Text style={{ marginLeft: 10, fontSize: 16 }}>爱豆 {userInfo.individualValues}</Text>
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
                    {userInfo?.photos?.map(reward => {
                      if(reward.type === 1){
                        return (
                          <View key={reward.id}>
                            <Image
                              style={{width: 60, height: 60, marginLeft: 5, borderRadius: 5, marginBottom: 10 }}
                              src={reward.url}
                              key={reward.id}
                              className='filterImg'
                            />
                            {userInfo.unlockPhotos === 2?
                              <BlurView
                                className='absoluteBlurView'
                                blurType='light'
                                blurAmount={8}
                                reducedTransparencyFallbackColor='white'
                              />
                            :
                              null
                            }
                          </View>
                        )
                      }else{
                        return (
                          <View key={reward.id}>
                            <Video
                              style={{width: 60, height: 60, marginLeft: 5, borderRadius: 5, marginBottom: 10 }}
                              src={reward.url}
                              key={reward.id}
                              autoplay={false}
                              loop={false}
                            />
                            {userInfo.unlockPhotos === 2?
                              <BlurView
                                className='absoluteBlurView'
                                blurType='light'
                                blurAmount={8}
                                reducedTransparencyFallbackColor='white'
                              />
                            :
                              null
                            }
                          </View>
                        )
                      }
                    })}
                    </Flex>
                  </WingBlank>
                  </View>
                </Card.Body>
              </Card>
              <Item
                thumb={null}
                disabled
                extra={`${userInfo.height}cm`}
                arrow='empty'
              >
              身高
              </Item>
              <Item
                thumb={null}
                disabled
                extra={`${userInfo.weight}kg`}
                arrow='empty'
              >
              体重
              </Item>
              <Item
                thumb={null}
                extra={userInfo.city}
                arrow='empty'
                disabled
              >
              常驻城市
              </Item>
              <Item
                thumb={null}
                extra={
                  userInfo.unlockWeChat === 2 ?
                  <Text style={{ color: '#3b99fc' }} onClick={this.spenMoneyLook}>
                    解锁查看
                  </Text>
                  :
                  <Text style={{ color: '#3b99fc' }} onClick={this.copyWx}>
                    {userInfo.wxAccount	}
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
          {userInfo.evaluated === 1 ?
          <Button type='primary' style={{ width: 150, backgroundColor: '#9409a8', borderColor: '#9409a8' }} disabled>已评价</Button>
          :
          <Button type='primary' style={{ width: 150, backgroundColor: '#9409a8', borderColor: '#9409a8' }} onPress={this.evaluation}>评价</Button>
          }
          {
            userInfo.unlockPhotos === 1 && userInfo.unlockWeChat === 1 ?
            <Button type='primary' style={{ width: 150, backgroundColor: '#2aa515', borderColor: '#2aa515' }} disabled>已解锁</Button>
            :
            <Button type='primary' style={{ width: 150, backgroundColor: '#2aa515', borderColor: '#2aa515' }} onPress={this.unlock}>解锁</Button>
          }
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
