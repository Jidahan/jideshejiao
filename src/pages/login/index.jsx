import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Icon, List, Button, WingBlank, InputItem, Toast, Checkbox, Modal, WhiteSpace } from '@ant-design/react-native'
import { ImageBackground, StyleSheet, SafeAreaView } from "react-native";
import { 
  getPhoneSendCode,
  appLogin,
} from './service';
import bgImg from '../../images/loginbgimg.png'
import loginlogo from '../../images/loginlogo.png'
import loginPhone from '../../images/loginPhone.png'
import loginYzm from '../../images/loginYzm.png'
import loginYqm from '../../images/loginYqm.png'
import signButton from '../../images/sign.png'
import touristlogin from '../../images/touristlogin.png'
import './index.less';

Toast.config({
  duration: 0
})
class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      phoneError: false,
      phoneValue: '',
      codeError: false,
      codeValue: '',
      yqmValue: '',
      registered: true,
      tourists: false,
      yqmError: false,
      time: 60,
      btnDisable:false,
      btnContent: '获取验证码',
    }
    this.loginSubmit = this.loginSubmit.bind(this)
    this.beforeTouristLoginSubmit = this.beforeTouristLoginSubmit.bind(this)
    this.beForeLoginSubmit = this.beForeLoginSubmit.bind(this)
  }

  componentDidMount() {}

  loginSubmit() {
    const { phoneValue, codeValue, yqmValue, tourists, registered } = this.state
    if(!phoneValue) {
      this.setState({ phoneError: true })
      return
    }
    if(!codeValue) {
      this.setState({ codeError: true })
      return
    }
    if(!registered && !tourists) {
      Toast.fail({
        content: '请选择注册用户/游客用户进行登录！',
        duration: 2
      })
      return
    }
    if(tourists){
      if(!yqmValue) {
        Toast.fail({
          content: '游客登录邀请码不能为空！',
          duration: 2
        })
        this.setState({ yqmError: true })
        return
      } 
      const key = Toast.loading('登录中...');
      appLogin({tel: this.state.phoneValue, code: this.state.codeValue, invitationCode: this.state.yqmValue}).then(res => {
        if(res.data.status === 200){
          Toast.remove(key);
          Taro.navigateTo({
            url: '/pages/login/components/genderPage/index'
          })
        }else{
          Toast.remove(key);
          Toast.fail({
            content: `${res.data.msg}`,
            duration: 2
          })
        }
      }).catch(error => {
        Toast.fail({
          content: `遇到了错误${error}`,
          duration: 2
        })
      })
    }else{
      const key = Toast.loading('登录中...');
      appLogin({tel: this.state.phoneValue, code: this.state.codeValue, invitationCode: this.state.yqmValue}).then(res => {
        console.log(res);
        if(res.data.status === 200){
          Toast.remove(key);
          Taro.setStorage({
            key: "token",
            data: res.data.data.accessToken
          })
          if(res.data.data.newUser === 1) {
            Taro.navigateTo({
              url: `/pages/login/components/genderPage/index?userId=${res.data.data.userId}`
            })
          }else{
            Taro.setStorage({
              key: "userId",
              data: res.data.data.userId,
              success: () => {
                Taro.switchTab({
                  url: '/pages/index/index'
                })
              }
            })
          }
        }else{
          Toast.remove(key);
          Toast.fail({
            content: `${res.data.msg}`,
            duration: 2
          })
        }
      }).catch(error => {
        Toast.fail({
          content: `遇到了错误${error}`,
          duration: 2
        })
      })
    }
   
  }

  beforeTouristLoginSubmit() {
    this.setState({ registered: false, tourists: true })
  }

  beForeLoginSubmit() {
    this.setState({ registered: true, tourists: false })
  }

  render() {
    let timeChange;
    let ti = this.state.time;
    //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
    const clock =()=>{
      if (ti > 0) {
        //当ti>0时执行更新方法
         ti = ti - 1;
         this.setState({
            time: ti,
            btnContent: `重新获取(${ti}s)`,
          });
      }else{
        //当ti=0时执行终止循环方法
        clearInterval(timeChange);
        this.setState({
          btnDisable: false,
          time: 60,
          btnContent: "获取验证码",
        });
      }
    };
    const sendCode = () =>{
      if(!this.state.phoneValue) {
        this.setState({ phoneError: true })
        Toast.fail({
          content: '请输入手机号！',
          duration: 2
        })
        return
      }
      const key = Toast.loading('发送中...');
      getPhoneSendCode(this.state.phoneValue).then(res => {
        if(res.data.status === 200){
          Toast.remove(key);
          Toast.success({
            duration: 1,
            content: '发送成功！'
          })
          this.setState({
            btnDisable: true,
            btnContent: "重新获取(60s)",
          });
          //每隔一秒执行一次clock方法
          timeChange = setInterval(clock,1000);
        }else{
          Toast.remove(key);
          Toast.fail({
            content: `遇到了错误${res.data.msg}`,
            duration: 2
          })
        }
      }).catch(error => {
        Toast.fail({
          content: `遇到了错误${error}`,
          duration: 2
        })
      })
      
    };

    return (
      <View style={styles.container}>
        <ImageBackground source={bgImg} style={styles.image}>
          <Text style={styles.loginText}>登录</Text>
          <Image
            style={styles.loginLogo}
            src={loginlogo}
          />
          <WingBlank size='lg' style={{ width: '80%' }}>
            <View>
              <InputItem
                clear
                error={this.state.phoneError}
                value={this.state.phoneValue}
                onChange={value => {
                  this.setState({
                    phoneError: false,
                    phoneValue: value,
                  });
                }}
                placeholder='请输入手机号'
                placeholderTextColor='#ffffff'
                type='phone'
                style={styles.phoneInput}
              >
                <Image src={loginPhone} style={styles.phone} className='boxShadowInput' />
              </InputItem>
              <Text style={{ backgroundColor: 'transparent', height: 20 }}></Text>
              <InputItem
                clear
                error={this.state.codeError}
                value={this.state.codeValue}
                onChange={value => {
                  this.setState({
                    codeError: false,
                    codeValue: value,
                  });
                }}
                placeholder='请输入验证码'
                placeholderTextColor='#ffffff'
                style={styles.phoneInput}
                extra={
                  <Button size='small' disabled={this.state.btnDisable} onPress={sendCode} style={styles.getYzm}><Text style={styles.yzmColor}>{this.state.btnContent}</Text></Button>
                }
              >
                <Image src={loginYzm} style={styles.phone} className='boxShadowInput' />
              </InputItem>
              <Text style={{ backgroundColor: 'transparent', height: 20 }}></Text>
              {
                this.state.registered ?
                <InputItem
                  clear
                  type='number'
                  error={this.state.yqmError}
                  value={this.state.yqmValue}
                  onChange={value => {
                    this.setState({
                      yqmError: false,
                      yqmValue: value,
                    });
                  }}
                  placeholderTextColor='#ffffff'
                  placeholder='请输入邀请码（选填）'
                  style={styles.phoneInput}
                >
                  <Image src={loginYqm} style={styles.phone} className='boxShadowInput' />
                </InputItem>
                :
                <InputItem
                  clear
                  type='number'
                  error={this.state.yqmError}
                  value={this.state.yqmValue}
                  onChange={value => {
                    this.setState({
                      yqmError: false,
                      yqmValue: value,
                    });
                  }}
                  placeholderTextColor='#ffffff'
                  placeholder='请输入邀请码（必填）'
                  style={styles.phoneInput}
                >
                  <Image src={loginYqm} style={styles.phone} className='boxShadowInput' />
                </InputItem>
              }
            </View>

          </WingBlank>
          {this.state.registered ?
           <View style={styles.bottomView}>
            <Image src={signButton} onClick={this.loginSubmit} style={styles.signUserButton} />
            <Text className='touristsButton' onClick={this.beforeTouristLoginSubmit}>游客登录</Text>
          </View>
          :
          <View style={styles.bottomView}>
            <Image src={touristlogin} onClick={this.loginSubmit} style={styles.signUserButton} />
            <Text className='touristsButton'onClick={this.beForeLoginSubmit}>注册用户登录</Text>
          </View>
          }
          
        </ImageBackground>
      </View>
    )
  }
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginText: {
    color: 'white',
    fontSize: 28
  },
  image: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loginLogo: {
    width: 130,
    height: 152
  },
  phoneInput: {
    marginLeft: -30,
    color: 'white',
  },
  phone: {
    width: 28,
    height: 28,
    padding: 0,
    margin: 0,
  },
  getYzm: {
    borderRadius: 20,
  },
  yzmColor: {
    color: '#FF939D'
  },
  signUserButton: {
    height: 60
  },
  bottomView: {
    alignItems: 'center'
  }
})