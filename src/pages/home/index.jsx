import { Component } from 'react'
import Taro from '@tarojs/taro'
import { createThumbnail } from "react-native-create-thumbnail";
import { View, Text, CoverView, CoverImage, Image, ScrollView, Video } from '@tarojs/components'
import { Icon, List, Button, WingBlank, Card, Toast, Flex, Modal } from '@ant-design/react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'
import zwImg from '../../images/zw.png'
import personInfoImg from '../../images/personInfo.png'
import manImg from '../../images/man.png'
import womenImg from '../../images/women.png'
import realPersonImg from '../../images/realPerson.png'
import photoImg from '../../images/photo.png'
import historyCallPersonImg from '../../images/historyCallPerson.png'
import invitecodeImg from '../../images/invitecode.png'
import shareImg from '../../images/share.png'
import adviceImg from '../../images/advice.png'
import versonImg from '../../images/verson.png'
import logoutImg from '../../images/logout.png'
import {
  personalCenter,
  uploadUrl,
  fileUpload,
} from './service';
import './index.less'

Toast.config({
  duration: 0
})

const Item = List.Item;
class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgArray: [],
      logoutVisible: false,
      userInfo: '',
      selectSmallImg: '',
      pushAll: false,
    },
    this.copyYqm = this.copyYqm.bind(this)
    this.adviceClick = this.adviceClick.bind(this)
    this.logoutClick = this.logoutClick.bind(this)
    this.logoutSubmit = this.logoutSubmit.bind(this)
    this.shareClick = this.shareClick.bind(this)
    this.personInfoClick = this.personInfoClick.bind(this)
    this.historyVisiti = this.historyVisiti.bind(this)
    this.addPhoto = this.addPhoto.bind(this)
    this.selectSmallImg = this.selectSmallImg.bind(this)
    this.addVideo = this.addVideo.bind(this)
    this.goPersonAuthentication = this.goPersonAuthentication.bind(this)
  }

  componentDidMount () {
    this.getUserMessage()
    Taro.eventCenter.on('refershHome',(arg)=>{
      if(arg?.status){
        this.getUserMessage()
        Taro.eventCenter.trigger('refershHome', {status: false})
      }
    })
  }

  getUserMessage() {
    const key = Toast.loading('加载中...')
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          personalCenter(res.data).then(data => {
            if(data.data.status === 200){
              Toast.remove(key)
              this.setState({ userInfo: data.data.data, imgArray: data.data.data.photos  })
            }else{
              Toast.fail({
                content: data.data.msg,
                duration: 2
              })
            }
          })
        }
      }
    })
  }
  

  personInfoClick() {
    Taro.navigateTo({
      url: `/pages/home/components/personInfoPage/index?data=${JSON.stringify(this.state.userInfo)}`
    })
  }

  copyYqm() {
    Clipboard.setString(this.state.userInfo.invitationCode)
    Toast.success({
      content: '复制成功',
      duration: 0.5,
      mask: true,
      stackable: false,
    });
  }

  adviceClick() {
    Taro.navigateTo({
      url: '/pages/home/components/advicePage/index'
    })
  }

  logoutClick() {
    this.setState({ logoutVisible: true })
  }

  logoutSubmit() {
    const key = Toast.loading('退出登录...');
    setTimeout(() => {
      Toast.remove(key);
      Toast.success({
        content: '退出成功！',
        duration: 0.2,
      })
      Taro.clearStorage()
      Taro.eventCenter.off();
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }, 1);
  }

  shareClick() {
    console.log('点击了分享');
  }

  addPhoto() {
    // const that = this
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera','user','environment'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: (res) => {
        this.uploadImage(res.tempFilePaths)
      },
      complete: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      }
    })
  }

  addVideo() {
    const that = this
    Taro.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        const key = Toast.loading('上传中...');
        Taro.getStorage({
          key: 'userId',
          complete: (storage) => {
            if (storage.errMsg === "getStorage:ok") {
              const formData = new FormData()
              let file = {uri: res.tempFilePath, type: 'multipart/form-data', name: 'file.mp4'};   //这里的key(uri和type和name)不能改变,
              formData.append('file', file)
              formData.append('tenantId', storage.data)
              fetch(uploadUrl,{
                method:'POST',
                headers:{
                  'Content-Type':'multipart/form-data',
                },
                body:formData,
              })
                .then((response) => {
                  return response.json();
                })
                .then((responseData)=>{
                  if(responseData.status === 200){
                    createThumbnail({
                      url: `${responseData.data.domain + responseData.data.path}`,
                      timeStamp: 1000,
                      format: 'png'
                    })
                      .then(response => {
                        const headImgData = new FormData()
                        let headFile = {uri: response.path, type: 'multipart/form-data', name: 'headfile.png'};
                        headImgData.append('file', headFile)
                        headImgData.append('tenantId', storage.data)
                        fetch(uploadUrl,{
                          method:'POST',
                          headers:{
                            'Content-Type':'multipart/form-data',
                          },
                          body: headImgData,
                        })
                        .then((headResponse) => {
                          return headResponse.json();
                        })
                        .then((headResponseData)=>{
                          console.log('headResponseData',headResponseData);
                          if(headResponseData.status === 200){
                            fileUpload({
                              type: 2,
                              url: [`${responseData.data.domain + responseData.data.path}`],
                              userId: storage.data,
                              videoUrl: headResponseData.data.domain + headResponseData.data.path
                            }).then(data => {
                              if(data.data.status === 200){
                                Toast.remove(key)
                                Toast.success({
                                  content: '上传成功',
                                  duration: 1
                                })
                                that.getUserMessage()
                              }else{
                                Toast.remove(key)
                                Toast.fail({
                                  content: data.data.msg,
                                  duration: 2
                                })
                              }
                            })
                          }
                        })
                      })
                      .catch(err => console.log({ err }));
                  }
                })
                .catch((error)=>{console.error('error',error)});
            }
          }
        })
      }
    })
  }

  // 上传图片
  uploadImage (tempFilePaths) {
    const key = Toast.loading('上传中...');
    Taro.getStorage({
      key: 'userId',
      complete: (storage) => {
        if (storage.errMsg === "getStorage:ok") {
          const formData = new FormData()
          let file = {uri: tempFilePaths[0], type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
          formData.append('file', file)
          formData.append('tenantId', storage.data)
          fetch(uploadUrl,{
            method:'POST',
            headers:{
              'Content-Type':'multipart/form-data',
            },
            body:formData,
          })
            .then((response) => {
              return response.json();
            })
            .then((responseData)=>{
              console.log('responseData',responseData);
              if(responseData.status === 200){
                fileUpload({
                  type: 1,
                  url: [`${responseData.data.domain + responseData.data.path}`],
                  userId: storage.data
                }).then(data => {
                  if(data.data.status === 200){
                    Toast.remove(key)
                    Toast.success({
                      content: '上传成功',
                      duration: 1
                    })
                    this.getUserMessage()
                  }else{
                    Toast.remove(key)
                    Toast.fail({
                      content: data.data.msg,
                      duration: 2
                    })
                  }
                })
              }
            })
            .catch((error)=>{console.error('error',error)});
        }
      }
    })
    
  }

  photo() {
    this.setState({ pushAll: true })
  }

  historyVisiti() {
    Taro.navigateTo({
      url: `/pages/home/components/historyVisit/index`
    })
  }

  selectSmallImg(reward) {
    this.setState({ selectSmallImg: reward })
  }

  myPhotosClick = (photos) => {
    Taro.navigateTo({
      url: `/pages/lookPhotos/index?data=${JSON.stringify(photos)}`,
    })
  }

  goPersonAuthentication() {
    console.log('进行真人认证');
  }

  render () {
    const {imgArray, userInfo, selectSmallImg} = this.state
    const imgArrayHeight = imgArray.length <= 5 ? 60 : imgArray.length < 11 && imgArray.length >= 6 ? 140 : 200 
    const topHeadBgImg = userInfo?.photos?.filter(reward => {
      return reward.url.indexOf('mp4') === -1
    })
    console.log(userInfo);
    return (
      <View>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f5f5f9', marginBottom: 100 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className='container'>
            <CoverView className='controls'>
              <CoverImage className='img' 
                src={
                  selectSmallImg 
                  || 
                  topHeadBgImg&&topHeadBgImg[0].url
                } 
              />
              <View className='rightTopImgAdd' onClick={this.addPhoto}>
                <Icon name='plus' size='md' />
              </View>
              <Text className='imgOnText'>{userInfo.nickName}</Text>
              <Text className='imgOnTwoText'>{userInfo.city} {userInfo.age}岁</Text>
              <View className='imgArray'>
                <ScrollView
                  scrollX
                >
                  {userInfo?.photos?.map(reward => {
                    if(reward.url.indexOf('mp4') === -1){
                      return (
                        <View style={{width: 50, height: 50, marginLeft: 10}} className={reward === this.state.selectSmallImg ? 'selectImgArrayOneImg' : ''} key={reward.id} onClick={() => this.selectSmallImg(reward)}>
                          <Image
                            style={{width: '100%', height: '100%', borderRadius: 10}}
                            src={reward?reward.url:null}
                          />
                        </View>
                      )
                    }
                  })}
                </ScrollView>
              </View>
              <View className='bottomText'>
                <Icon name='alert' size='md' color='#efb336' />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>全身照越多(至少一张正面俩张侧面),才能被评为男神！</Text>
              </View>
            </CoverView>
          </View>
          <List style={{ marginTop: 10 }}>
            <Item arrow='horizontal' 
              thumb={
                <Image src={personInfoImg} className='iconSizeStyle' />
              }
              onPress={this.personInfoClick}
            >
              个人资料
            </Item>
            <Item arrow='horizontal' 
              thumb={
                <Image src={manImg} className='iconSizeStyle' style={{ width: 30, height: 30 }} />
                // <Image src={womenImg} className='iconSizeStyle' style={{ width: 30, height: 30 }} />
              }
              onPress={() => {}}
              extra='审核中'
            >
              男神认证
            </Item>
            <Item
              thumb={
                <Image src={realPersonImg} className='iconSizeStyle' />
              }
              onPress={this.goPersonAuthentication}
              extra={userInfo.personAuthentication === 1 ? '已认证' : '进行认证'}
              arrow='empty'
              disabled={userInfo.personAuthentication === 1}
            >
              真人认证
            </Item>
            <WingBlank size='lg'>
              <Card>
                <Card.Header
                  title='我的相册'
                  thumbStyle={{ width: 30, height: 30 }}
                  thumb={
                    <Image src={photoImg} className='iconSizeStyle' />
                  }
                  extra={
                    <Item arrow='horizontal' 
                      onPress={this.photo.bind(this)} 
                    >
                      <Text style={{ marginLeft: 10 }}>上传照片/视频</Text>
                    </Item>
                  }
                />
                <Card.Body style={{ height: imgArrayHeight, overflow: 'hidden' }}>
                  <View style={{ height: 42, display: 'flex', flexDirection: 'row', marginTop: -5 }} onClick={() => this.myPhotosClick(userInfo?.photos)}>
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
                              poster={reward.videoUrl}
                              showCenterPlayBtn={false}
                            />
                          </View>
                        )
                      }
                    })}
                      
                    </Flex>
                  </WingBlank>
                  </View>
                </Card.Body>
                <Card.Footer
                  content='上传更多照片，才能吸引异性～'
                />
              </Card>
            </WingBlank>
            <Item 
              arrow='horizontal' 
              thumb={
                <Image src={historyCallPersonImg} className='iconSizeStyle' />
              }
              onPress={this.historyVisiti}
              extra={`有${userInfo.historicalVisitorsNums}个人看过你`}
            >
              历史访客
            </Item>
            <Item
              thumb={
                <Image src={invitecodeImg} className='iconSizeStyle' />
              }
              disabled
              extra={
                <View className='copyExtra' style={{ position: 'relative' }}>
                  <Text style={{position: 'absolute', bottom: -8, left: 30}}>{userInfo.invitationCode}</Text>
                  <Button style={{position: 'absolute', right: 15, bottom: -16}} type='primary' className='copyButton' onPress={this.copyYqm}>复制</Button>
                </View>
              }
            >
              邀请码
            </Item>
            <Item arrow='horizontal' 
              thumb={
                <Image src={shareImg} className='iconSizeStyle' />
              }
              onPress={this.shareClick}
            >
              分享给好友
            </Item>
            <Item arrow='horizontal' 
              thumb={
                <Image src={adviceImg} className='iconSizeStyle' />
              }
              onPress={this.adviceClick}
            >
              意见反馈
            </Item>
            <Item
              thumb={
                <Image src={versonImg} className='iconSizeStyle' />
              }
              extra={
                <Text>V1.0.1</Text>
              }
            >
              当前版本
            </Item>
            <Item
              thumb={
                <Image src={logoutImg} className='iconSizeStyle' />
              }
              extra={null}
              onPress={this.logoutClick}
            >
              退出账号
            </Item>
          </List>
        </ScrollView>
        <Modal
          title={null}
          transparent
          onClose={() => {
            this.setState({ logoutVisible: false })
          }}
          maskClosable
          visible={this.state.logoutVisible}
          footer={[
            { text: '取消', onPress: () => this.setState({ logoutVisible: false }) },
            { text: '确认退出', onPress: this.logoutSubmit },
          ]}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ textAlign: 'center' }}>确认退出登录吗？</Text>
          </View>
        </Modal>
        <Modal
          popup
          closable
          maskClosable
          visible={this.state.pushAll}
          animationType='slide-up'
          onClose={() => this.setState({ pushAll: false })}
        >
          <View className='popupView'>
            <Text style={{ padding: 36, textAlign: 'center' }} className='popupModal' onClick={this.addPhoto}>上传照片</Text>
            <Text style={{ padding: 36 }} onClick={this.addVideo}>上传视频</Text>
          </View>
        </Modal>
      </View>

    )
  }
}

export default connect(
  ({
    home,
    loading,
  }) => ({
    home,
    loading,
  }),
)(Home);