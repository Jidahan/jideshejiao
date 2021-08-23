import { Component } from 'react';
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { Icon, Button, Checkbox, Toast } from '@ant-design/react-native';
import imgArr from './imgArr'

import './index.less';

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
        imgSum: 1
      }
    }

    componentDidMount() {
      this.start()
    }

    start = () => {
      clearInterval(this.setInterval)
      this.setState({
        // apiKey: '7E79IypZU29vnFZ0RBBA6SBY',
        // appID: '24034341',
        // secretKey: 'B4EazYkGnjVxSoPpWhVe6vfpmGgkVD1b',
        apiKey: 'ufFxjMqCidfloW6ly8rEAaEH',
        appID: '24724593',
        secretKey: 'BlzQA6al6KFxdd44LB242mZx4gcCX8PP',
      }, () => {
        Taro.request({
          url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.state.apiKey}&client_secret=${this.state.secretKey}`,
          header: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          complete: (res) => {
            if (res.statusCode === 200) {
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
                    console.log(sessionId);
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
                      Toast.fail(sessionId.data.error_msg)
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
        sourceType: ['album','camera'],
        maxDuration: 8,
        camera: 'front',
        success: function (res) {
          console.log(res);
          res.tempFilePath.replace('.mov', '.mp4')
          var file = new File([res.tempFilePath], "video.mp4" ,{type: "video/mp4", lastModified: new Date});
          console.log(file);
          const fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = function () { 
            const base64 = this.result.substring(this.result.indexOf(',')+1)
            console.log(base64);
            Taro.request({
              url: `https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/verify?access_token=${that.state.access_token}`,
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              data: {
                type_identify: 'action',
                video_base64: base64,
                session_id: that.state.sessionId,
              },
              complete: (personInfo) => {
                console.log(personInfo);
                // Taro.switchTab({
                //   url: '/pages/index/index'
                // })
                if (personInfo.data.err_no === 0) {
                }else{
                  Toast.fail(personInfo.data.error_msg)
                }
              }
            })
          }
      
        }
      })
    }

  render() {
    const { code, imgSum } = this.state
    const codeText = code === '0' ? '眨眼' : code === '2' ? '右转' : code === '3' ? '左转' : code === '4' ? '抬头' : code === '5' ? '低头' : '错误'
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

