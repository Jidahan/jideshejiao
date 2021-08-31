import { Component } from 'react';
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components';
import { Button, InputItem, List, Toast } from '@ant-design/react-native';
import { connect } from 'react-redux';
import editUserInfoButtonImg from '../../../../../../images/editUserInfo.png'

import './index.less';

class Edituserinfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      value: '',
      error: false
    }
    this.formSubmit = this.formSubmit.bind(this)
  }

  componentDidMount() {
    console.log(this.props);
    const key = this.props.route.params.key
    let title = ''
    switch (key) {
      case 'nickName':
        title = '昵称'
        break;
      case 'height':
        title = '身高'
        break;
      case 'weight':
        title = '体重'
        break;
      case 'aidou':
        title = '个人价值'
        break;
      case 'wx':
        title = '微信'
        break;
      default:
        break;
    }
    this.setState({ title })
    Taro.setNavigationBarTitle({
      title
    })
  }
  
  formSubmit() {
    if(!this.state.value){
      this.setState({ error: true })
      return
    }else{
      const { title } = this.state
      if(title === '昵称'){
        this.props.dispatch({
          type: 'userInfo/editPersonNickName',
          payload: this.state.value,
          callback: (response) => {
            if (response === '200') {
              Taro.navigateBack({
                delta: 1,
                success: () => {
                  Taro.eventCenter.trigger('editUserPageSubmit', {status: true})
                }
              })
            } else {
              Toast.fail({
                content: '出错了～',
                duration: 2
              })
            }
          }
        })
        
      }else if(title === '身高'){
        this.props.dispatch({
          type: 'userInfo/editPersonHeight',
          payload: this.state.value,
          callback: (response) => {
            if (response === '200') {
              Taro.navigateBack({
                delta: 1,
                success: () => {
                  Taro.eventCenter.trigger('editUserPageSubmit', {status: true})
                }
              })
            } else {
              Toast.fail({
                content: '出错了～',
                duration: 2
              })
            }
          }
        })
      }else if(title === '体重'){
        this.props.dispatch({
          type: 'userInfo/editPersonWeight',
          payload: this.state.value,
          callback: (response) => {
            if (response === '200') {
              Taro.navigateBack({
                delta: 1,
                success: () => {
                  Taro.eventCenter.trigger('editUserPageSubmit', {status: true})
                }
              })
            } else {
              Toast.fail({
                content: '出错了～',
                duration: 2
              })
            }
          }
        })
      }else if(title === '个人价值'){
        this.props.dispatch({
          type: 'userInfo/editPersonAidou',
          payload: this.state.value,
          callback: (response) => {
            if (response === '200') {
              Taro.navigateBack({
                delta: 1,
                success: () => {
                  Taro.eventCenter.trigger('editUserPageSubmit', {status: true})
                }
              })
            } else {
              Toast.fail({
                content: '出错了～',
                duration: 2
              })
            }
          }
        })
      }else if(title === '微信'){
        this.props.dispatch({
          type: 'userInfo/editPersonwx',
          payload: this.state.value,
          callback: (response) => {
            if (response === '200') {
              Taro.navigateBack({
                delta: 1,
                success: () => {
                  Taro.eventCenter.trigger('editUserPageSubmit', {status: true})
                }
              })
            } else {
              Toast.fail({
                content: '出错了～',
                duration: 2
              })
            }
          }
        })
      }
    }
  }

  render() {
    const { title } = this.state
    return (
      <View className='editUserInfo-page'>
        <InputItem
          clear
          error={this.state.error}
          value={this.state.value}
          onChange={value => {
            this.setState({
              error: false,
              value,
            });
          }}
          extra={title === '昵称' ? '' : title === '身高' ? 'cm' : title === '体重' ? 'kg' : title === '爱豆' ? '颗' : ''}
          placeholder={title === '微信' ? '虚假账号有被封号风险，请认真填写' : `请输入${title}`}
          style={{ backgroundColor: '#E5E5E5'}}
        ></InputItem>
        <Image src={editUserInfoButtonImg} onClick={this.formSubmit} className='editUserInfoButton' />
      </View>
    )
  }
}

export default connect(
  ({
    userInfo
  }) => ({
    userInfo
  }),
)(Edituserinfo);