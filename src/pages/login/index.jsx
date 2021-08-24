import { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Icon, List, Button, WingBlank, InputItem, Toast, Checkbox, Modal, WhiteSpace } from '@ant-design/react-native'
import { connect } from 'react-redux';
import { 
  getPhoneSendCode,
  appLogin,
} from './service';

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
  }

  componentDidMount() { }

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
      Toast.fail('请选择注册用户/游客用户进行登录！')
      return
    }
    if(tourists){
      if(!yqmValue) {
        Toast.fail('游客登录邀请码不能为空！')
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
          Toast.fail(`${res.data.msg}`)
        }
      }).catch(error => {
        Toast.fail(`遇到了错误${error}`)
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
          Taro.setStorage({
            key: "userId",
            data: res.data.data.userId
          })
          Taro.setStorage({
            key: "newUser",
            data: res.data.data.newUser
          })
          Taro.navigateTo({
            url: '/pages/login/components/genderPage/index'
          })
        }else{
          Toast.remove(key);
          Toast.fail(`${res.data.msg}`)
        }
      }).catch(error => {
        Toast.fail(`遇到了错误${error}`)
      })
    }
   
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
        Toast.fail('请输入手机号！')
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
          Toast.fail(`遇到了错误${res.data.msg}`)
        }
      }).catch(error => {
        Toast.fail(`遇到了错误${error}`)
      })
      
    };

    return (
      <View className='login-page'>
        <WingBlank size='lg' style={{ width: '80%' }}>
          <List>
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
              style={{ marginLeft: -30 }}
              type='phone'
            >
              <Icon name='mobile' style={{ padding: 0, margin: 0 }} />
            </InputItem>
            <Text style={{ backgroundColor: '#eee' }}></Text>
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
              style={{ marginLeft: -30 }}
              extra={
                <Button size='small' type='ghost' disabled={this.state.btnDisable} onPress={sendCode}>{this.state.btnContent}</Button>
              }
            >
              <Icon name='safety-certificate' style={{ padding: 0, margin: 0 }} />
            </InputItem>
            <Text style={{ backgroundColor: '#eee' }}></Text>
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
              placeholder='请输入邀请码'
            >
              <View>
                <Text>邀请码</Text><Text style={{ color: '#a51ce2' }}>(选填)</Text>
              </View>
            </InputItem>
          </List>
          <WhiteSpace size='lg' />
          <View className='bottomSelect'>
            <Checkbox
              checked={this.state.registered}
              // style={{ color: '#f00' }}
              onChange={event => {
                this.setState({ tourists: false, registered: event.target.checked });
              }}
            >
              注册用户
            </Checkbox>
            <Checkbox
              checked={this.state.tourists}
              // style={{ color: '#f00' }}
              onChange={event => {
                this.setState({ registered:false, tourists: event.target.checked });
              }}
            >
              游客用户
            </Checkbox>
          </View>
          <WhiteSpace size='lg' />
          <Button type='primary' onPress={this.loginSubmit}>登录</Button>

        </WingBlank>
      </View>
    )
  }
}

export default Login
// 下面用来connect数据层
// export default connect(
//   ({
//     login,
//   }) => ({
//     login,
//   }),
// )(Login);
