import Taro from '@tarojs/taro'
import { Component } from 'react';
import { View, Textarea } from '@tarojs/components';
import { Platform, TextInput } from 'react-native'

import { Button, WingBlank, WhiteSpace, Toast, TextareaItem } from '@ant-design/react-native';
import { feedback } from './service';



import './index.less';

class Advicepage extends Component {

  constructor(props){
    super(props)
    this.state = {
      inputValue: '',
      error: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {

  };

  inputOnChange(text) {
    this.setState({ error: false }, () => {
      this.setState({ inputValue: text })
    })
  }

  onSubmit() {
    if (!this.state.inputValue) {
      this.setState({ error: true });
      Toast.fail('输入有误！');
      return
    }
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          const key = Toast.loading('提交中...');
          feedback({content: this.state.inputValue+'', userId: res.data}).then(data => {
            if(data.data.status === 200){
              Toast.remove(key)
              Toast.success({
                content: `提交成功`,
                duration: 1
              })
              this.setState({ inputValue: '' })
              this.refs.textareaItem.setState({inputCount: 0})
              this.refs.textareaItem.textAreaRef.clear()
            }else{
              Toast.remove(key)
              Toast.fail({
                content: data.data.msg,
                duration: 1
              })
            }
          })
        } else {
          console.log('获取存储数据失败');
        }
      }
    })
    
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (Platform.OS === 'ios') {
      if (this.state.inputValue!== nextState.inputValue) {
        return false;
      }
    }
    return true;
  };

  render() {
    return (
      <View>
        <WhiteSpace size='xl' />
          <WingBlank>
            <TextareaItem 
              rows={10} 
              placeholder='请输入您的意见' 
              count={100} 
              clear
              onChange={(text) => this.inputOnChange(text)}
              error={this.state.error}
              ref='textareaItem'
            />
            <WhiteSpace size='xl' />
            <WhiteSpace size='xl' />
            <Button type='primary' onPress={this.onSubmit}>提交</Button>
          </WingBlank>
      </View>
    )
  }
}

export default Advicepage