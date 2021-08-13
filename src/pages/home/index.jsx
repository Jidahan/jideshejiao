import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Icon, List, Button, WingBlank, Card, Toast, Flex, Modal } from '@ant-design/react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'
import adImg from '../../images/ad.png'
import headImg from '../../images/1.png'
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
} from './service';
import './index.less'

const Item = List.Item;
class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgArray: [],
      avatarSource: '',
      logoutVisible: false,
      userInfo: ''
    },
    this.copyYqm = this.copyYqm.bind(this)
    this.adviceClick = this.adviceClick.bind(this)
    this.logoutClick = this.logoutClick.bind(this)
    this.logoutSubmit = this.logoutSubmit.bind(this)
    this.shareClick = this.shareClick.bind(this)
    this.personInfoClick = this.personInfoClick.bind(this)
    this.historyVisiti = this.historyVisiti.bind(this)
  }

  componentDidMount () {
    let imgArray = []
    for(let i = 1; i <= 10; i++) {
      imgArray.push({ id: i })
    }
    this.setState({ imgArray })
    // this.props.dispatch({ 
    //   type: 'home/saveData',
    // })
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
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }, 1);
  }

  shareClick() {
    console.log('点击了分享');
  }

  photo() {
    const options = {
      title: '拍照选择器',
      customButtons: [{ name: 'fb', title: '自定义按钮标题' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      cancelButtonTitle:'取消',
      takePhotoButtonTitle:'点击拍照',
      chooseFromLibraryButtonTitle:'从本地库相册导入',
      chooseWhichLibraryTitle:'从其他库打开',
      tintColor:'#CB0000' 
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  historyVisiti() {
    Taro.navigateTo({
      url: '/pages/home/components/historyVisit/index'
    })
  }

  render () {
    const {imgArray, userInfo, avatarSource} = this.state
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
              <CoverImage className='img' src={userInfo.photo} />
              <Icon name='plus' size='md' className='rightTopImgAdd' />
              <Text className='imgOnText'>{userInfo.nickName}</Text>
              <Text className='imgOnTwoText'>{userInfo.city} {userInfo.age}岁</Text>
              <View className='imgArray'>
                <ScrollView
                  scrollX
                >
                  {userInfo?.photos?.map(reward => {
                    return (
                      <View style={{width: 50, height: 50, marginLeft: 10}} className={reward.id === 0 ? 'selectImgArrayOneImg' : ''} key={reward.id}>
                        <Image
                          style={{width: '100%', height: '100%', borderRadius: 10}}
                          src={reward.url}
                        />
                      </View>
                    )
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