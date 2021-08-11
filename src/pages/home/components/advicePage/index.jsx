import { Component } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { Button, WingBlank, WhiteSpace, TextareaItem, Toast } from '@ant-design/react-native'
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
    Toast.success(`输入的内容为${this.state.inputValue}`);
    this.setState({ inputValue: '' });
    this.refs.textareaItem.setState({inputCount: 0});
  }

  render() {
    return (
      <View>
        <WhiteSpace size='xl' />
        <WhiteSpace size='xl' />
        <WhiteSpace size='xl' />
        <WhiteSpace size='xl' />
        <WhiteSpace size='xl' />
        <WhiteSpace size='xl' />
          <WingBlank>
            <TextareaItem 
              rows={10} 
              placeholder='请输入您的意见' 
              count={100} 
              clear
              onChange={(text) => this.inputOnChange(text)}
              error={this.state.error}
              value={this.state.inputValue}
              ref='textareaItem'
            />
            <WhiteSpace size='xl' />
            <WhiteSpace size='xl' />
            <WhiteSpace size='xl' />
            <Button type='primary' onPress={this.onSubmit}>提交</Button>
          </WingBlank>
      </View>
    )
  }
}

export default Advicepage