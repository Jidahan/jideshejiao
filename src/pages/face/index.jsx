import { Component } from 'react';
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { Toast } from '@ant-design/react-native';
import imgArr from './imgArr'
import {
  uploadUrl,
  faceDetect
} from './service'

import './index.less';

Toast.config({
  duration: 0
})
class face extends Component {

    constructor(props) {
      super(props)
      this.state = {
        apiKey: '',
        appID: '',
        secretKey: '',
        access_token: '',
        sessionId: '',
        code: '',
        scrollImage:[],
        imgSum: 1,
        userId: '',
        gender: ''
      }
    }

    componentDidMount() {
      this.start()

      Taro.getStorage({
        key: 'userId',
        complete: (res) => {
          if (res.errMsg === "getStorage:ok") {
            this.setState({ userId: res.data })
          }
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

    start = () => {
      this.setState({
        apiKey: '7E79IypZU29vnFZ0RBBA6SBY',
        appID: '24034341',
        secretKey: 'B4EazYkGnjVxSoPpWhVe6vfpmGgkVD1b',
        // apiKey: 'ufFxjMqCidfloW6ly8rEAaEH',
        // appID: '24724593',
        // secretKey: 'BlzQA6al6KFxdd44LB242mZx4gcCX8PP',
      }, () => {
        Taro.request({
          url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.state.apiKey}&client_secret=${this.state.secretKey}`,
          header: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          complete: (res) => {
            if (res.statusCode === 200) {
              console.log('res.data.access_token', res.data.access_token);
              this.setState({ access_token: res.data.access_token }, () => {
                Taro.request({
                  url: `https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/sessioncode?access_token=${res.data.access_token}`,
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  data: {
                    type: 1,
                    min_code_length: 1,
                    max_code_length: 1
                  },
                  complete: (sessionId) => {
                    console.log('sessionId', sessionId);
                    if (sessionId.data.err_no === 0) {
                      this.setState({ sessionId: sessionId.data.result.session_id, code: sessionId.data.result.code }, () => {
                        this.setInterval = setInterval(() => {
                          let num = this.state.imgSum;  ++num;
                          let codeSum
                          switch (sessionId.data.result.code) {
                            case '0':
                              codeSum = 19
                              break;
                            case '1':
                              codeSum = 23
                              break;
                            case '2':
                              codeSum = 31
                              break;
                            case '3':
                              codeSum = 31
                              break;
                            case '4':
                              codeSum = 31
                              break;
                            case '5':
                              codeSum = 31
                              break;
                            default:
                              break;
                          }
                          if(num === codeSum) num = 1
                          this.setState({ imgSum: num })
                        }, 130);
                      })
                    }else{
                      Toast.fail({
                        content: sessionId.data.error_msg,
                        duration: 2
                      })
                    }
                  }
                })
              })
            }
          }
        })
      })
    }

    goPersonVideo = () => {
      console.log('clear');
      const that = this
      this.setInterval && clearInterval(this.setInterval)
      Taro.chooseVideo({
        camera: 'front',
        sourceType: ['camera', 'album'],
        maxDuration: 8,
        success: function (res) {
          const key = Toast.loading('认证中...');
          const formData = new FormData()
          let file = {uri: res.tempFilePath, type: 'multipart/form-data', name: 'file.mp4'};   //这里的key(uri和type和name)不能改变,
          formData.append('file', file)
          formData.append('accessToken', that.state.access_token)
          formData.append('sessionId', that.state.sessionId)
          fetch(uploadUrl,{
            method:'POST',
            headers:{
              'Content-Type':'multipart/form-data',
            },
            body: formData,
          })
            .then((response) => {
              return response.json();
            })
            .then((responseData)=>{
              if(responseData.status === 200){
                const data = JSON.parse(responseData.data)
                const { result: {best_image: {pic}}, err_no, error_msg } = data            
                if(data.err_no === 0) {
                  faceDetect({
                    type: 1,
                    userId: that.state.userId,
                    gender: that.state.gender,
                    base: pic,
                  }).then(data => {
                    if(data.data.status === 200){
                      Toast.remove(key)
                      Toast.success({
                        content: '认证成功，即将跳转...',
                        duration: 1
                      })
                      setTimeout(() => {
                        clearInterval(that.setInterval)
                        Taro.switchTab({
                          url: '/pages/index/index'
                        })
                      }, 1000);
                    }else{
                      Toast.remove(key)
                      Toast.fail({
                        content: data.data.msg,
                        duration: 2
                      })
                    }
                  })
                }else{
                  Toast.remove(key)
                  switch (err_no) {
                    case 216430:
                    case 216431:
                    case 216432:
                    case 216433:
                    case 216434:
                      Toast.fail({
                        content: '请重新尝试',
                        duration: 2
                      })
                      break;
                    case 216500:
                      Toast.fail({
                        content: '验证码错误',
                        duration: 2
                      })
                      break;
                    case 216501: 
                      Toast.fail({
                        content: '没有找到人脸',
                        duration: 2
                      })
                      break;
                    case 216502: 
                      Toast.fail({
                        content: '当前会话已失效,请重新进入页面',
                        duration: 2
                      })
                      break;
                    case 216507: 
                      Toast.fail({
                        content: '视频中有多张人脸，请重新录制',
                        duration: 2
                      })
                      break;
                    case 216908: 
                      Toast.fail({
                        content: '视频中人脸质量过低，请重新录制视频',
                        duration: 2
                      })
                      break;
                    default:
                      Toast.fail({
                        content: error_msg,
                        duration: 2
                      })
                      break;
                  }
                }
              }
            })
            .catch((error)=>{console.error('error',error)});
        }
      })
    }

  render() {
    const { code, imgSum } = this.state
    const codeText = code === '0' ? '眨眼' : code === '2' ? '右转' : code === '3' ? '左转' : code === '4' ? '抬头' : code === '5' ? '低头' : '加载中'
    return (
      <SafeAreaView className='container'>
        <View className='outView' style={styles.oneView}>
          <Text className='fontBold'>请按要求录制视频（{codeText}）</Text>
        </View>

        <View className='personBorder' onClick={this.goPersonVideo}>
          <Image src={imgArr[`png${code}_${imgSum}`]} style={styles.actionImg} />
          {/* <Image src={imgArr[`png0_1`]} style={styles.actionImg} /> */}
          <Text style={styles.againVideo}>点击开始录制</Text>
        </View>

        <View style={styles.bottomText}>
          <View className='flexRow'>
            <View style={styles.iconStyle}></View>
            <View>
              <Text style={styles.iconRightOneText}>环境安静，光线充足</Text>
            </View>
          </View>

          <View className='flexRow'>
            <View style={styles.iconStyle}></View>
            <View>
              <Text style={styles.iconRightOneText}>面部清晰完整</Text>
            </View>
          </View>

          <View className='flexRow'>
            <View style={styles.iconStyle}></View>
            <View>
              <Text style={styles.iconRightOneText}>按提示顺序做标准动作</Text>
            </View>
          </View>

          <View className='flexRow'>
            <View style={styles.iconStyle}></View>
            <View>
              <Text style={styles.iconRightOneText}>拍摄3-5秒</Text>
            </View>
          </View>
        </View>
    
      </SafeAreaView>
    )
  }
}

export default face


const styles = StyleSheet.create({
  bottomButton: {
    borderRadius: 20,
    width: '80%',
  },
  agreeText: {
    color: '#3b99fc'
  },
  outViewBottom: {
    marginBottom: 20
  },
  bottomText: {
    marginBottom: 20
  },
  textTwo: {
    fontSize: 36,
    marginTop: 10
  },
  oneView: {
    marginTop: 40
  },
  iconStyle: {
    backgroundColor: '#3b99fc',
    width: 18,
    height: 18,
    borderRadius: 18,
    margin: 10,
    marginRight: 20
  },
  iconRightOneText: {
    fontSize: 20
  },
  iconRightTwoText: {
    fontSize: 16,
    marginTop: 10
  },
  actionImg: {
    width: 200,
    height: 200
  },
  againVideo: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  }
});

