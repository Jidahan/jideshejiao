import { Component } from 'react'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs';
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Card, WhiteSpace, WingBlank, Button, List, InputItem, DatePicker, NoticeBar, Toast } from '@ant-design/react-native'
import { ImageBackground } from 'react-native'
import headImg from '../../../../images/1.png'
import editPersonImg from '../../../../images/editPersonImg.png'
import editUserInfoButtonImg from '../../../../images/editUserInfo.png'
import './index.less';
import {
  userSetting, 
  uploadUrl,
  fileUpload,
  faceDetect
} from './service';

const Item = List.Item;
class Personinfopage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nickName: '',
      nickNameError: false,
      cityName: '',
      cityNameError: false,
      birthdayName: '',
      wxNameError: false,
      wxName: '',
      heightError: false,
      height: '',
      weightError: false,
      weight: '',
      aidouError: false,
      aidou: '',
      photos: '',
      newPhoto: ''
    }
    this.formSubmit = this.formSubmit.bind(this)
    this.birthdayOnChange = this.birthdayOnChange.bind(this)
    this.updateHeadImg = this.updateHeadImg.bind(this)
    this.goCityPage = this.goCityPage.bind(this)
    this.goEditPage = this.goEditPage.bind(this)
  }

  componentDidMount() { 
    const { route:{params:{data}} } = this.props
    const userInfo = JSON.parse(data)
    this.setState({ 
      nickName: userInfo?.nickName,
      cityName: userInfo?.city,
      birthdayName: userInfo?.birthday === '' ? '' : userInfo?.birthday,
      wxName: userInfo?.wxAccount,
      height: userInfo?.height,
      weight: userInfo?.weight,
      aidou: userInfo?.individualValues,
      photos: userInfo?.photos.length === 0 ? '' : userInfo?.photos
    })

    Taro.eventCenter.on('updatePersonInfoPageCity',(arg)=>{
      if(arg?.status){
        this.setState({ cityName: arg?.city })
      }
    })

    Taro.eventCenter.on('editUserPageSubmit',(arg)=>{
      if(arg?.status){
        this.props.dispatch({
          type: 'userInfo/returnAllState',
          callback: (response) => {
            this.setState({ 
              nickName: response.nickName,
              wxName: response.wx,
              height: response.height,
              weight: response.weight,
              aidou: response.aidou,
            })
          }
        })
      }
    })
  }

  formSubmit(e) {
    const { nickName, cityName, wxName, height, weight, aidou, birthdayName } = this.state
    if(!nickName) { Toast.fail({ content: '昵称为空', duration: 2 }); return }
    if(!cityName) { Toast.fail({ content: '常驻城市为空', duration: 2 }); return }
    if(!wxName) { Toast.fail({ content: '微信为空', duration: 2 }); return }
    if(!height) { Toast.fail({ content: '身高为空', duration: 2 }); return }
    if(!weight) { Toast.fail({ content: '体重为空', duration: 2 }); return }
    if(!aidou) { Toast.fail({ content: '个人价值为空', duration: 2 }); return }
    if(!birthdayName) {
      Toast.fail({
        content: '请填写生日',
        duration: 1,
        mask: true,
        stackable: false,
      });
      return
    }
    const key = Toast.loading('保存中...');
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          userSetting({
            birthday: birthdayName,
            city: cityName,
            height,
            weight,
            individualValues: aidou,
            nickName,
            wxAccount: wxName,
            id: res.data
          }).then(data => {
            console.log(data.data.status);
            if(data.data.status === 200){
              Toast.remove(key);
              Toast.success({
                content: '保存成功！',
                duration: 1,
              })
              Taro.navigateBack({
                delta: 1
              })
              Taro.eventCenter.trigger('refershHome', {status: true})
            }else{
              Toast.remove(key);
              Toast.fail(data.data.msg)
            }
          })
        }
      }
    })
  }

  updateHeadImg() {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera','user','environment'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: (res) => {
        this.uploadImage(res.tempFilePaths)
      },
      complete: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // this.setState({ newPhoto: res.tempFilePath[0] })
      }
    })
  }

  goCityPage() {
    this.props.dispatch({
      type: 'home/editPersonPageGoStatus',
      payload: true
    }).then(() => {
      Taro.navigateTo({
        url: `/pages/citySelect/index`
      })
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
                          Taro.eventCenter.trigger('refershHome', {status: true})
                          this.setState({ newPhoto: responseData.data.domain + responseData.data.path })
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
            })
          })
          
        }
      }
    })
    
  }

  birthdayOnChange(value) {
    this.setState({ birthdayName: value });
  }

  goEditPage(key) {
    Taro.navigateTo({
      url: `/pages/home/components/personInfoPage/components/editUserInfo?key=${key}`
    })
  }

  render() {
    const topHeadBgImg = this.state.photos&&this.state.photos?.filter(reward => {
      return reward.url.indexOf('mp4') === -1
    })
    
    const sourceUrl = {
      uri: this.state.newPhoto || topHeadBgImg&&topHeadBgImg.length > 0 && topHeadBgImg[0].url
    }
    return (
      <View style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <List>
          <Item disabled extra={
            <View className='imgOutView'>
              <ImageBackground
                source={sourceUrl || headImg}
                style={{width:100,height:100}} imageStyle={{borderRadius:100}}
              >
                <Image src={editPersonImg} className='imgOnTextBottom' />
              </ImageBackground>
            </View>
          } onPress={this.updateHeadImg}
          >
            头像
          </Item>
          <Item disabled extra={this.state.nickName || ''} arrow='horizontal' onPress={() => this.goEditPage('nickName')}>
            昵称
          </Item>
          <DatePicker
            value={!this.state.birthdayName ? '' : new Date(this.state.birthdayName)}
            mode='date'
            defaultDate={new Date()}
            minDate={new Date(1900, 7, 6)}
            maxDate={new Date(2026, 11, 3)}
            onChange={this.birthdayOnChange}
            format='YYYY-MM-DD'
          >
            <List.Item arrow='horizontal'>生日</List.Item>
          </DatePicker>
          <Item disabled extra={this.state.height&&this.state.height+'cm' || ''} arrow='horizontal' onPress={() => this.goEditPage('height')}>
            身高
          </Item>
          <Item disabled extra={this.state.weight&&this.state.weight+'kg' || ''} arrow='horizontal' onPress={() => this.goEditPage('weight')}>
            体重
          </Item>
          <Item disabled extra={this.state.aidou+'爱豆/颗' || ''} arrow='horizontal' onPress={() => this.goEditPage('aidou')}>
            个人价值
          </Item>
          <Item disabled extra={this.state.cityName || ''} arrow='horizontal' onPress={this.goCityPage}>
            常住城市
          </Item>
          <View className='myCode'>
            <View className='mycodeLeft'></View>
            <Text className='mycodeRight'>社交账号</Text>
          </View>
          <Item disabled extra={this.state.wxName || '未填写'} arrow='horizontal' onPress={() => this.goEditPage('wx')}>
            微信
          </Item>
        </List>
        <Image src={editUserInfoButtonImg} onClick={this.formSubmit} className='editUserInfoButton' />
        
         {/* <ScrollView
           style={{ backgroundColor: '#f5f5f9', marginBottom: 10 }}
           automaticallyAdjustContentInsets={false}
           showsHorizontalScrollIndicator={false}
           showsVerticalScrollIndicator={false}
         >
       
          <View style={{ marginTop: 88 }}>
            <WingBlank size='lg'>
              <Card>
                <Card.Body>
                  <WingBlank size='lg'>
                    <List>
                      <InputItem
                        clear
                        error={this.state.nickNameError}
                        value={this.state.nickName}
                        onChange={nickName => {
                          this.setState({
                            nickNameError: false, nickName,
                          });
                        }}
                        extra={null}
                        placeholder='昵称'
                      >
                        昵称
                      </InputItem>
                      <WhiteSpace />
                      <InputItem
                        clear
                        error={this.state.cityNameError}
                        value={this.state.cityName}
                        onFocus={this.goCityPage}
                        onChange={cityName => {
                          this.setState({
                            cityNameError:false, cityName,
                          });
                        }}
                        extra={null}
                        placeholder='常驻城市'
                      >
                        常驻城市
                      </InputItem>
                      <WhiteSpace />
                      <DatePicker
                        value={new Date(this.state.birthdayName)}
                        mode='date'
                        defaultDate={new Date()}
                        minDate={new Date(1900, 7, 6)}
                        maxDate={new Date(2026, 11, 3)}
                        onChange={this.birthdayOnChange}
                        format='YYYY-MM-DD'
                      >
                        <List.Item arrow='horizontal'>生日</List.Item>
                      </DatePicker>
                      <WhiteSpace />
                      <NoticeBar mode='' icon={customIcon}>
                        请填写真实账号，填写虚假账号可能会封号！
                      </NoticeBar>
                      <WhiteSpace />
                      <InputItem
                        clear
                        error={this.state.wxNameError}
                        value={this.state.wxName}
                        onChange={wxName => {
                          this.setState({
                            wxNameError:false, wxName,
                          });
                        }}
                        extra={null}
                        placeholder='微信'
                      >
                        微信
                      </InputItem>
                      <WhiteSpace />
                      <InputItem
                        clear
                        error={this.state.heightError}
                        value={this.state.height+''}
                        onChange={height => {
                          this.setState({
                            heightError:false, height,
                          });
                        }}
                        placeholder='身高'
                        extra='cm'
                        type='number'
                      >
                        身高/cm
                      </InputItem>
                      <WhiteSpace />
                      <InputItem
                        clear
                        error={this.state.weightError}
                        value={this.state.weight+''}
                        onChange={weight => {
                          this.setState({
                            weightError:false, weight,
                          });
                        }}
                        placeholder='体重'
                        extra='kg'
                        type='number'
                      >
                        体重/kg
                      </InputItem>
                      <InputItem
                        clear
                        error={this.state.aidouError}
                        value={this.state.aidou+''}
                        onChange={aidou => {
                          this.setState({
                            aidouError:false, aidou,
                          });
                        }}
                        placeholder='个人价值(爱豆/颗)'
                        extra='颗'
                        type='number'
                      >
                        个人价值(爱豆/颗)
                      </InputItem>
                    </List>

                  </WingBlank>
                </Card.Body>
              </Card>
              <Button type='primary' onPress={this.formSubmit}>保存</Button>

            </WingBlank>
          </View>
          
          
        </ScrollView> */}
      </View>
    )
  }
}

export default connect(
  ({
    home,
    userInfo
  }) => ({
    home,
    userInfo
  }),
)(Personinfopage);