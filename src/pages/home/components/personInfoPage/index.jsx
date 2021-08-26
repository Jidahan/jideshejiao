import { Component } from 'react'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Card, WhiteSpace, WingBlank, Button, List, InputItem, DatePicker, NoticeBar, Toast } from '@ant-design/react-native'
import adImg from '../../images/ad.png'
import headImg from '../../images/1.png'
import './index.less';
import {
  userSetting, 
  uploadUrl,
  fileUpload
} from './service';

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
  }

  componentDidMount() { 
    const { route:{params:{data}} } = this.props
    const userInfo = JSON.parse(data)
    this.setState({ 
      nickName: userInfo.nickName,
      cityName: userInfo.city,
      birthdayName: userInfo.birthday,
      wxName: userInfo.wxAccount,
      height: userInfo.height,
      weight: userInfo.weight,
      aidou: userInfo.individualValues,
      photos: userInfo.photos
    })

    Taro.eventCenter.on('updatePersonInfoPageCity',(arg)=>{
      if(arg?.status){
        this.setState({ cityName: arg?.city })
      }
    })
  }

  formSubmit(e) {
    const { nickName, cityName, wxName, height, weight, aidou, birthdayName } = this.state
    if(!nickName) { this.setState({ nickNameError: true }); return }
    if(!cityName) { this.setState({ cityNameError: true }); return }
    if(!wxName) { this.setState({ wxNameError: true }); return }
    if(!height) { this.setState({ heightError: true }); return }
    if(!weight) { this.setState({ weightError: true }); return }
    if(!aidou) { this.setState({ aidouError: true }); return }
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
                    Taro.eventCenter.trigger('refershHome', {status: true})
                    this.setState({ newPhoto: responseData.data.domain + responseData.data.path })
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

  birthdayOnChange(value) {
    this.setState({ birthdayName: value });
  }

  render() {
    const customIcon = (
      <Image
        src='https://zos.alipayobjects.com/rmsportal/bRnouywfdRsCcLU.png'
        style={{ width: 12, height: 12 }}
      />
    );

    const topHeadBgImg = this.state.photos&&this.state.photos?.filter(reward => {
      return reward.url.indexOf('mp4') === -1
    })

    return (
      <View>
         <ScrollView
           style={{ backgroundColor: '#f5f5f9', marginBottom: 10 }}
           automaticallyAdjustContentInsets={false}
           showsHorizontalScrollIndicator={false}
           showsVerticalScrollIndicator={false}
         >
          <View className='container'>
            <CoverView className='controls'>
              <CoverImage className='img' src={adImg} />
              <View className='imgOnTextView'>
                <Image
                  src={this.state.newPhoto || topHeadBgImg&&topHeadBgImg[0].url || headImg}
                  className='imgOnText'
                  onClick={this.updateHeadImg}
                />
              </View>
              <Text className='imgOnTwoText' onClick={this.updateHeadImg}>上传头像</Text>
            </CoverView>
          </View>
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
          
          
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  ({
    home,
  }) => ({
    home,
  }),
)(Personinfopage);