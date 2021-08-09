import { Component } from 'react'
import { View, ScrollView, Input } from '@tarojs/components'
import { Flex, WhiteSpace, WingBlank, Button } from '@ant-design/react-native';
import { TextInput } from 'react-native';
// import { connect } from 'react-redux'
import './index.less'

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  UNSAFE_componentWillMount () { }
  
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <ScrollView
        style={{ flex: 1 }}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View className='topSearch'>
          <View>
            <TextInput 
              type='text' 
              placeholder='输入昵称搜索' 
              focus 
              className='searchInput'
              keyboardType='web-search'
              // keyboardAppearance='dark'
            />
          </View>
          <View>
            <Button size='small' className='searchRightButton'>附近</Button>
          </View>
        </View>
        <WhiteSpace size='xl' />
          <WingBlank style={{ marginBottom: 5 }}>
            <Flex>
              <Flex.Item style={{ paddingLeft: 4, paddingRight: 4 }}>
                <Button size='small'>按钮1</Button>
              </Flex.Item>
              <Flex.Item style={{ paddingLeft: 4, paddingRight: 4 }}>
                <Button size='small'>按钮2</Button>
              </Flex.Item>
              <Flex.Item style={{ paddingLeft: 4, paddingRight: 4 }}>
                <Button size='small'>按钮3</Button>
              </Flex.Item>
            </Flex>
          </WingBlank>
        <WhiteSpace />
      </ScrollView>
    )
  }
}

export default Index
  