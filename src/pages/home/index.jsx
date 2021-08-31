import { Component } from 'react'
import Taro from '@tarojs/taro'
import { createThumbnail } from "react-native-create-thumbnail";
import { ImageBackground } from 'react-native';
import { View, Text, CoverView, CoverImage, Image, ScrollView, Video } from '@tarojs/components'
import { Icon, List, Button, WingBlank, Card, Toast, Flex, Modal } from '@ant-design/react-native'
import RNFS from 'react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard'
import ImagePicker from 'react-native-image-picker'
import zwImg from '../../images/zw.png'
import personInfoImg from '../../images/personInfo.png'
import manImg from '../../images/homeman.png'
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
  faceDetect,
  switchAuthenticationStatus,
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
      gender: ''
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
    this.personAuth = this.personAuth.bind(this)
  }

  componentDidMount () {
    this.getUserMessage()
    Taro.eventCenter.on('refershHome',(arg)=>{
      if(arg?.status){
        this.getUserMessage()
        Taro.eventCenter.trigger('refershHome', {status: false})
      }
    })
    Taro.getStorage({
      key: 'gender',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          this.setState({ gender: res.data })
        }
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
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera','user','environment'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: (res) => {
        this.uploadImage(res.tempFilePaths)
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
        const { duration } = res //视频时间毫秒数
        const key = Toast.loading('上传/认证中...');
        Taro.getStorage({
          key: 'userId',
          complete: (storage) => {
            if (storage.errMsg === "getStorage:ok") {
              console.log('parseInt(parseInt(duration / 1000) / 2) * 1000', parseInt(parseInt(duration / 1000) / 2) * 1000, parseInt(duration));
              createThumbnail({ //截取第1秒照片
                url: res.tempFilePath,
                timeStamp: 1000,
                format: 'png'
              })
                .then(response => { //得到第1秒的照片
                  createThumbnail({ //开始截取中间照片
                    url: res.tempFilePath,
                    timeStamp: parseInt(parseInt(duration / 1000) / 2) * 1000,
                    format: 'png'
                  }).then(videoCenterImg => { //得到中间的照片
                    createThumbnail({ //截取结尾照片
                      url: res.tempFilePath,
                      timeStamp: parseInt(duration),
                      format: 'png'
                    }).then(videoEndImg => { //得到结尾的照片
                      RNFS.readFile(response.path, 'base64')
                      .then((oneImgBase) => {
                        RNFS.readFile(videoCenterImg.path, 'base64')
                        .then((twoImgBase) => {
                          RNFS.readFile(videoEndImg.path, 'base64')
                          .then((threeImgBase) => {
                            faceDetect({ //进行人脸对比
                              type: 2,
                              userId: storage.data,
                              imgUrl: '',
                              base: twoImgBase,
                              baseList: [
                                oneImgBase, 
                                twoImgBase,
                                threeImgBase,
                              ],
                            }).then(personTrueFalsedata => {
                              if(personTrueFalsedata.data.status === 200){ //人脸对比成功
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
                                  .then((upresponsedata) => {
                                    return upresponsedata.json();
                                  })
                                  .then((responseData)=>{
                                    if(responseData.status === 200){
                                      const headImgData = new FormData()
                                      let headFile = {uri: response.path, type: 'multipart/form-data', name: 'headfile.png'};
                                      headImgData.append('file', headFile)
                                      fetch(uploadUrl,{ //上传第1秒照片
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
                                      
                                    }
                                  })
                                  .catch((error)=>{console.error('error',error)});
                              }else{
                                Toast.remove(key)
                                Toast.fail({
                                  content: personTrueFalsedata.data.msg,
                                  duration: 2
                                })
                              }
                            })
                          })
                        })
                      })
                    })
                  })
                })
                .catch(err => console.log({ err }));
            }
          }
        })
      }
    })
  }

  // 上传图片
  uploadImage (tempFilePaths) {
    const key = Toast.loading('上传/认证中...');
    Taro.getStorage({
      key: 'userId',
      complete: (storage) => {
        if (storage.errMsg === "getStorage:ok") {
          const formData = new FormData()
          let file = {uri: tempFilePaths[0], type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
          formData.append('file', file)
          formData.append('tenantId', storage.data)
          RNFS.readFile(tempFilePaths[0], 'base64')
          .then((content) => {
            // content 为base64数据
            faceDetect({
              imgUrl: '',
              type: 2,
              userId: storage.data,
              base: content
            }).then(personTrueFalsedata => {
              if(personTrueFalsedata.data.status === 200){
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
              }else{
                Toast.remove(key)
                Toast.fail({
                  content: personTrueFalsedata.data.msg,
                  duration: 2
                })
              }
            }).catch(error => {
              Toast.remove(key)
              Toast.fail({
                content: '上传失败，请重试',
                duration: 2
              })
            })
          })
          .catch((err) => {
            console.log("reading error: " + err);
          });
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

  myPhotosClick = (url) => {
    // Taro.navigateTo({
    //   url: `/pages/lookPhotos/index?data=${JSON.stringify(this.state.userInfo.photos)}&key=${key}`,
    // })

    const userInfoPhotos = this.state.userInfo.photos.filter((item) => {
      return item.type === 1
    })
    const i1=userInfoPhotos.findIndex((value)=>value.url===url);
    let imgAry = userInfoPhotos.map(reward => {
      return reward.url
    })

    Taro.previewImage({
      urls: imgAry,
      current: imgAry[i1]
    })
  }

  myVideoClick = (id) => {
    let videoContext = Taro.createVideoContext(id)
    videoContext.requestFullScreen()
  }

  goPersonAuthentication() {
    console.log('进行真人认证');
  }

  personAuth() {
    switchAuthenticationStatus({
      certificationLevel: 2,
      id: this.state.userInfo.id
    }).then(data => {
      if(data.data.status === 200){
        Toast.success({
          content: '已提交男神认证',
          duration: 1
        })
        this.getUserMessage()
      }else{
        Toast.fail({
          content: data.data.msg,
          duration: 2
        })
      }
    })
  }

  render () {
    const {imgArray, userInfo, selectSmallImg} = this.state
    const imgArrayHeight = imgArray.length <= 5 ? 60 : imgArray.length < 11 && imgArray.length >= 6 ? 140 : 200 
    const topHeadBgImg = userInfo?.photos?.filter(reward => {
      return reward.url.indexOf('mp4') === -1
    })
    console.log(userInfo);

    const sourceUrl = {
      uri: selectSmallImg 
      || 
      topHeadBgImg&&topHeadBgImg.length > 0&&topHeadBgImg[0].url
    }
    return (
      <View>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f5f5f9', marginBottom: 100 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className='container'>
            <ImageBackground className='img' source={sourceUrl}>
              <View className='rightTopImgAdd' onClick={this.addPhoto}>
                <Icon name='plus' size='md' style={{ color: 'white', fontSize: 30 }} />
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
                <Text style={{ color: 'white', fontWeight: 'bold' }}>全身照越多(至少一张正面俩张侧面),才能被评为{this.state.gender === 2 ? '女神' : '男神'}！</Text>
              </View>
            </ImageBackground>
            {/* <CoverView className='controls'>
              <CoverImage className='img' 
                src={
                  selectSmallImg 
                  || 
                  topHeadBgImg&&topHeadBgImg.length > 0&&topHeadBgImg[0].url
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
                <Text style={{ color: 'white', fontWeight: 'bold' }}>全身照越多(至少一张正面俩张侧面),才能被评为{this.state.gender === 2 ? '女神' : '男神'}！</Text>
              </View>
            </CoverView> */}
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
                this.state.gender === 2 ?
                <Image src={manImg} className='iconSizeStyle' style={{ width: 30, height: 30 }} />
                :
                <Image src={manImg} className='iconSizeStyle' style={{ width: 30, height: 30 }} />
              }
              onPress={userInfo.certificationLevel !== 1 ? null : this.personAuth}
              extra={userInfo.certificationLevel === 1 ? '普通用户' : userInfo.certificationLevel === 2 ? '待审核' : userInfo.certificationLevel === 3 ? '男神' : userInfo.certificationLevel === 4 ? '女神' : ''}
            >
             {this.state.gender === 2 ? '女神认证' : '男神认证'}
            </Item>
            <Item
              thumb={
                <Image src={realPersonImg} className='iconSizeStyle' />
              }
              onPress={this.goPersonAuthentication}
              extra={userInfo.personAuthentication === 1 ? '已认证' : '点击进行认证'}
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
                  <View style={{ height: 42, display: 'flex', flexDirection: 'row', marginTop: -5 }} >
                  <WingBlank>
                    <Flex wrap='wrap'>
                    {userInfo?.photos?.map(reward => {
                      if(reward.type === 1){
                        return (
                          <View key={reward.id} onClick={() => this.myPhotosClick(reward.url)}>
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
                          <View key={reward.id} onClick={() => this.myVideoClick(`videocc${reward.id}`)}>
                            <Video
                              style={{width: 60, height: 60, marginLeft: 5, borderRadius: 5, marginBottom: 10 }}
                              src={reward.url}
                              key={reward.id}
                              autoplay={false}
                              loop={false}
                              poster={reward.videoUrl}
                              showCenterPlayBtn={false}
                              id={`videocc${reward.id}`}
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

export default Home