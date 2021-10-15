import { Component } from 'react'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import RNFS from 'react-native-fs';
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Card, WhiteSpace, WingBlank, Button, List, InputItem, DatePicker, NoticeBar, Toast } from '@ant-design/react-native'
import { ImageBackground, TextInput } from 'react-native'
import headImg from '../../../../images/zwWomen.png'
import headImgMan from '../../../../images/zwMan.png'
import editPersonImg from '../../../../images/editPersonImg.png'
import editUserInfoButtonImg from '../../../../images/editUserInfo.png'
import './index.less';
import {
  userSetting, 
  uploadUrl,
  fileUpload,
  faceDetect,
  personalCenter
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
      newPhoto: '',
      goPageType: '',
      userId: '',
      gender: ''
    }
    this.formSubmit = this.formSubmit.bind(this)
    this.birthdayOnChange = this.birthdayOnChange.bind(this)
    this.updateHeadImg = this.updateHeadImg.bind(this)
    this.goCityPage = this.goCityPage.bind(this)
    // this.goEditPage = this.goEditPage.bind(this)
  }

  componentDidMount() { 
    const { route:{params:{data, type, userId}} } = this.props
    Taro.eventCenter.on('updatePersonInfoPageCity',(arg)=>{
      if(arg?.status){
        this.setState({ cityName: arg?.city })
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
    if(!userId){
      Taro.getStorage({
        key: 'userId',
        complete: (res) => {
          if (res.errMsg === "getStorage:ok") {
            this.setState({ userId: res.data })
          }
        }
      })
    }else{
      this.setState({ userId })
    }
    this.setState({ goPageType: type })
    if(!data){
      personalCenter(userId).then(userInfoData => {
        if(userInfoData.statusCode === 200){
          const userData = userInfoData.data.data
          this.setState({ 
            nickName: !userData.nickName ? '' : userData.nickName,
            wxName: !userData.wxAccount ? '' : userData.wxAccount,
            height: !userData.height ? '' : userData.height + '',
            weight: !userData.weight ? '' : userData.weight + '',
            aidou: !userData.individualValues ? '' : userData.individualValues + '',
            cityName: !userData.city ? '' : userData.city,
            birthdayName: !userData.birthday ? '' : userData.birthday,
            photos: !userData.photo ? '' : userData.photo,
          })
        }else{
          Toast.fail({
            content: userInfoData.data.data.msg,
            duration: 1.5
          })
        }
      }).catch(error => {
        Toast.fail({
          content: `遇到了错误${error}`,
          duration: 2
        })
      })


    }else{
      const userInfo = JSON.parse(data)
      console.log(userInfo);
      this.setState({ 
        nickName: userInfo?.nickName + '',
        cityName: userInfo?.city + '',
        birthdayName: userInfo?.birthday === '' ? '' : userInfo?.birthday,
        wxName: !userInfo.wxAccount ? '' : userInfo.wxAccount + '',
        height: !userInfo.height ? '' : userInfo.height + '',
        weight: !userInfo.weight ? '' : userInfo.weight + '',
        aidou: !userInfo.individualValues ? '' : userInfo.individualValues + '',
        photos: !userInfo.photo ? '' : userInfo.photo + '',
        gender: userInfo?.gender+ ''
      })
  
      Taro.eventCenter.on('updatePersonInfoPageCity',(arg)=>{
        if(arg?.status){
          this.setState({ cityName: arg?.city })
        }
      })
    }
    
  }

  formSubmit(e) {
    const { nickName, cityName, wxName, height, weight, aidou, birthdayName, goPageType, userId } = this.state
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
    const personData = {
      birthday: birthdayName,
      city: cityName,
      height,
      weight,
      individualValues: aidou,
      nickName,
      wxAccount: wxName,
      id: userId,
      gender: this.state.gender,
    }
    if (this.state.newPhoto) personData.photo = this.state.newPhoto
    userSetting(
      personData
    //   {
    //   birthday: birthdayName,
    //   city: cityName,
    //   height,
    //   weight,
    //   individualValues: aidou,
    //   nickName,
    //   wxAccount: wxName,
    //   id: userId,
    //   gender: this.state.gender,
    //   photo: this.state.newPhoto
    // }
    ).then(data => {
      console.log(data.data.status);
      if(data.data.status === 200){
        Toast.remove(key);
        Toast.success({
          content: '保存成功！',
          duration: 1,
        })
        if(goPageType === 'signUser') {
          Taro.setStorage({
            key: "userId",
            data: userId,
            success: () => {
              Taro.switchTab({
                url: '/pages/index/index'
              })
            }
          })
        }else{
          Taro.navigateBack({
            delta: 1
          })
          Taro.eventCenter.trigger('refershHome', {status: true})
        }
      }else{
        Toast.remove(key);
        Toast.fail({
          content: data.data.msg,
          duration: 2
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

  updateHeadImg() {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
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
    const formData = new FormData()
    let file = {uri: tempFilePaths[0], type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
    formData.append('file', file)
    formData.append('tenantId', this.state.userId)
    RNFS.readFile(tempFilePaths[0], 'base64')
    .then((content) => {
      // content 为base64数据
      faceDetect({
        imgUrl: '',
        type: 2,
        userId: this.state.userId,
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
                Toast.remove(key)
                Toast.success({
                  content: '认证成功',
                  duration: 1
                })
                this.setState({ newPhoto: responseData.data.domain + responseData.data.path })
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
          content: `遇到了错误${error}`,
          duration: 2
        })
      })
    })
  }

  birthdayOnChange(value) {
    this.setState({ birthdayName: value });
  }

  // goEditPage(key) {
  //   Taro.navigateTo({
  //     url: `/pages/home/components/personInfoPage/components/editUserInfo?key=${key}`
  //   })
  // }

  render() {
    const initHeadImg = this.state.gender === 1 ? headImgMan : headImg
    let sourceUrl
    if(this.state.newPhoto || this.state.photos) {
      sourceUrl = {uri: this.state.newPhoto || this.state.photos}
    }else{
      sourceUrl = initHeadImg
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
          <Item 
            extra={
              <TextInput
                style={{ borderColor: 'white', width: 200, height: 30, textAlign: 'right', fontSize: 16, color: '#767676' }}
                onChangeText={text => this.setState({ nickName: text })}
                value={this.state.nickName}
                clearButtonMode='while-editing'
                keyboardAppearance='default'
              />
            }
            arrow='horizontal' 
          >
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
          <Item 
            extra={
              <TextInput
                style={{ borderColor: 'white', width: 200, height: 30, textAlign: 'right', fontSize: 16, color: '#767676' }}
                onChangeText={text => this.setState({ height: text })}
                onBlur={() => this.setState({ height: this.state.height + '' })}
                value={this.state.height&&this.state.height || ''}
                clearButtonMode='while-editing'
                keyboardAppearance='default'
                keyboardType='numeric'
              />
            }
            arrow='horizontal'
          >
            身高
          </Item>
          <Item 
            extra={
              <TextInput
                style={{ borderColor: 'white', width: 200, height: 30, textAlign: 'right', fontSize: 16, color: '#767676' }}
                onChangeText={text => this.setState({ weight: text })}
                onBlur={() => this.setState({ weight: this.state.weight + '' })}
                value={this.state.weight&&this.state.weight || ''}
                clearButtonMode='while-editing'
                keyboardAppearance='default'
                keyboardType='numeric'
              />
            }
            arrow='horizontal'
          >
            体重
          </Item>
          <Item 
            extra={
              <TextInput
                style={{ borderColor: 'white', width: 200, height: 30, textAlign: 'right', fontSize: 16, color: '#767676' }}
                onChangeText={text => this.setState({ aidou: text })}
                onBlur={() => this.setState({ aidou: this.state.aidou + '' })}
                value={this.state.aidou || ''}
                clearButtonMode
                keyboardAppearance='default'
                keyboardType='numeric'
              />
            }
            arrow='horizontal'
          >
            个人价值
          </Item>
          <Item disabled extra={this.state.cityName || ''} arrow='horizontal' onPress={this.goCityPage}>
            常住城市
          </Item>
          <View className='myCode' style={{ justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <View className='mycodeLeft'></View>
              <Text className='mycodeRight'>社交账号</Text>
            </View>
            <Text style={{ color: 'red' }}>*虚假账号有被封号风险，请认真填写</Text>
          </View>
          <Item disabled 
            extra={
              <TextInput
                style={{ borderColor: 'white', width: 200, height: 30, textAlign: 'right', fontSize: 16, color: '#767676' }}
                onChangeText={text => this.setState({ wxName: text })}
                onBlur={() => this.setState({ wxName: this.state.wxName })}
                value={this.state.wxName || ''}
                clearButtonMode
                keyboardAppearance='default'
              />
            } 
            arrow='horizontal' 
          >
            微信
          </Item>
        </List>
        <Image src={editUserInfoButtonImg} onClick={this.formSubmit} className='editUserInfoButton' />
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