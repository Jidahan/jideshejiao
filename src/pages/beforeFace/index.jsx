import { Component } from 'react';
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { Icon, Button, Checkbox, Toast } from '@ant-design/react-native';

import './index.less';

class Beforeface extends Component {

  constructor(props) {
    super(props)
    this.state = {
      registered: false
    }
    this.goPersonTrue = this.goPersonTrue.bind(this)
  }

  componentDidMount() { }

  goPersonTrue() {
    if(!this.state.registered){
      Toast.fail({
        content: '请阅读并同意《实名认证用户隐私协议》',
        duration: 2
      })
    }else{
      Taro.navigateTo({
        url: `/pages/face/index?userId=${this.props.route.params.userId}`
      })
    }
  }

  render() {
    return (
      <SafeAreaView className='container'>
        <View className='outView' style={styles.oneView}>
          <Text className='fontBold'>为保证您的信息安全</Text>
          <Text className='fontBold' style={styles.textTwo}>请进行人脸识别认证</Text>
        </View>

        <View>
          <View className='flexRow'>
            <Icon name='user' style={styles.iconStyle} />
            <View>
              <Text style={styles.iconRightOneText}>确保本人操作</Text>
              <Text style={styles.iconRightTwoText}>非本人操作将无法通过认证</Text>
            </View>
          </View>

          <View className='flexRow'>
            <Icon name='alert' style={styles.iconStyle} />
            <View>
              <Text style={styles.iconRightOneText}>识别光线适中</Text>
              <Text style={styles.iconRightTwoText}>请保证光线不要过暗或过亮</Text>
            </View>
          </View>

          <View className='flexRow'>
            <Icon name='contacts' style={styles.iconStyle} />
            <View>
              <Text style={styles.iconRightOneText}>正面对准手机</Text>
              <Text style={styles.iconRightTwoText}>保证您的脸出现在取景框内</Text>
            </View>
          </View>
        </View>
     
    
        <View className='outView' style={styles.outViewBottom}>
          <Button type='primary' style={styles.bottomButton} onPress={this.goPersonTrue}>开始身份认证</Button>
          <View className='flexRow' style={styles.bottomText}>
            <Checkbox
              checked={this.state.registered}
              onChange={event => {
                this.setState({ registered: event.target.checked });
              }}
            >
              阅读并同意
            </Checkbox>
            <Text style={styles.agreeText}>《实名认证用户隐私协议》</Text>
          </View>
        </View>
      
      </SafeAreaView>
    )
  }
}

export default Beforeface

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
    marginTop: 10
  },
  textTwo: {
    fontSize: 36,
    marginTop: 10
  },
  oneView: {
    marginTop: 88
  },
  iconStyle: {
    color: '#3b99fc',
    fontSize: 50,
    margin: 20
  },
  iconRightOneText: {
    fontSize: 20
  },
  iconRightTwoText: {
    fontSize: 16,
    marginTop: 10
  }
});

