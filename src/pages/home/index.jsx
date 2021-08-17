import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
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
  }

  componentDidMount () {
    let imgArray = []
    for(let i = 1; i <= 10; i++) {
      imgArray.push({ id: i })
    }
    this.setState({ imgArray })
    this.getUserMessage()
  }

  getUserMessage() {
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          personalCenter(res.data).then(data => {
            if(data.data.status === 200){
              console.log(data);
              this.setState({ userInfo: data.data.data  })
            }else{
              Toast.fail(data.data.data)
            }
          })
        }
      }
    })
  }
  

  personInfoClick() {
    Taro.navigateTo({
      url: '/pages/home/components/personInfoPage/index'
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

  // getVideoBase64(url) {
  //   return new Promise(function (resolve, reject) {
  //     let dataURL = '';
  //     let video = document.createElement("video");
  //     video.setAttribute('crossOrigin', 'anonymous');//处理跨域
  //     video.setAttribute('src', url);
  //     video.setAttribute('width', 400);
  //     video.setAttribute('height', 240);
  //     video.setAttribute('preload', 'auto');
  //     video.addEventListener('loadeddata', function () {
  //       let canvas = document.createElement("canvas"),
  //           width = video.width, //canvas的尺寸和图片一样
  //           height = video.height;
  //       canvas.width = width;
  //       canvas.height = height;
  //       canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
  //       dataURL = canvas.toDataURL('image/jpeg'); //转换为base64
  //       resolve(dataURL);
  //     });
  //   })
  // }

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
                  console.log('responseData',responseData);
                  if(responseData.status === 200){
                    fileUpload({
                      type: 2,
                      url: [`${responseData.data.domain + responseData.data.path}`],
                      userId: storage.data
                    }).then(data => {
                      if(data.data.status === 200){
                        Toast.remove(key)
                        Toast.success('上传成功')
                        this.getUserMessage()
                      }else{
                        Toast.remove(key)
                        Toast.fail(data.data.msg)
                      }
                    })
                    // that.getVideoBase64(`${responseData.data.domain + responseData.data.path}`).then(headImg => {
                    //   console.log(headImg);
                     
                    // })
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
  // 这里涉及到多图一起上传的处理
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
                    Toast.success('上传成功')
                    this.getUserMessage()
                  }else{
                    Toast.remove(key)
                    Toast.fail(data.data.msg)
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
      url: '/pages/home/components/historyVisit/index'
    })
  }

  selectSmallImg(reward) {
    this.setState({ selectSmallImg: reward })
  }

  render () {
    const {imgArray, userInfo, selectSmallImg} = this.state
    const imgArrayHeight = imgArray.length <= 5 ? 60 : imgArray.length < 11 && imgArray.length >= 6 ? 120 : 180 
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
              <CoverImage className='img' src={selectSmallImg || userInfo&&userInfo.photos[0]?.url} />
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
              onPress={() => {}}
              extra='已认证'
              arrow='empty'
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
                  <View style={{ height: 42, display: 'flex', flexDirection: 'row', marginTop: -5 }}>
                  <WingBlank>
                    <Flex wrap='wrap'>
                      {imgArray
                        .map((reward) => {
                          return <Image
                            style={{width: 60, height: 60, marginLeft: 5 }}
                            src={zwImg}
                            key={reward.id}
                          />
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