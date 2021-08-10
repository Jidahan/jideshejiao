import { Component } from 'react'
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Icon, List, Button, WingBlank, Card, Toast } from '@ant-design/react-native'
import Clipboard from '@react-native-clipboard/clipboard';
import { connect } from 'react-redux'
import adImg from '../../images/ad.png'
import headImg from '../../images/1.png'
import './index.less'

const Item = List.Item;
class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgArray: []
    },
    this.copyYqm = this.copyYqm.bind(this)
  }

  UNSAFE_componentWillMount () { }

  componentDidMount () {
    let imgArray = []
    for(let i = 0; i <= 20; i++) {
      imgArray.push({ id: i })
    }
    this.setState({ imgArray })
    this.props.dispatch({ 
      type: 'home/saveData',
    })
    // console.log('two', this.props.loading.effects['home/saveData'])

   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  copyYqm() {
    Clipboard.setString('hhhhhhhh')
    Toast.success('复制成功!!!', 1);
  }

  render () {
    const {imgArray} = this.state

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#f5f5f9' }}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View className='container'>
          <CoverView className='controls'>
            <CoverImage className='img' src={adImg} />
            <Icon name='plus' size='md' color='red' className='rightTopImgAdd' />
            <Text className='imgOnText'>去去去去去去去</Text>
            <Text className='imgOnTwoText'>西安市 0岁</Text>
            <View className='imgArray'>
              <ScrollView
                scrollX
              >
                {imgArray.map(reward => {
                  return (
                    <View style={{width: 50, height: 50, marginLeft: 10}} className='selectImgArrayOneImg' key={reward.id}>
                      <Image
                        style={{width: '100%', height: '100%', borderRadius: 10}}
                        src={headImg}
                      />
                    </View>
                  )
                })}
              </ScrollView>
            </View>
            <View className='bottomText'>
              <Icon name='alert' size='md' color='#efb336' />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>全身照越多(至少一张正面俩张侧面),才能被评为男神！</Text>
            </View>
          </CoverView>
        </View>
        <List style={{ marginTop: 10 }}>
          <Item arrow='horizontal' 
            thumb='https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png'
            onPress={() => {}}
          >
            个人资料
          </Item>
          <Item arrow='horizontal' 
            thumb='https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png'
            onPress={() => {}}
            extra='审核中'
          >
            男神认证
          </Item>
          <Item arrow='horizontal' 
            thumb='https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png'
            onPress={() => {}}
            extra='已认证'
          >
            真人认证
          </Item>
          <WingBlank size='lg'>
            <Card>
              <Card.Header
                title='我的相册'
                thumbStyle={{ width: 30, height: 30 }}
                thumb='https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg'
                extra={
                  <Item arrow='horizontal' 
                    onPress={() => {}}
                  >
                    <Text style={{ marginLeft: 10 }}>上传照片/视频</Text>
                  </Item>
                }
              />
              <Card.Body>
                <View style={{ height: 42 }}>
                  {/* <Text style={{ marginLeft: 16 }}>Card Content</Text> */}
                </View>
              </Card.Body>
              <Card.Footer
                content='上传更多照片，才能吸引异性～'
              />
            </Card>
          </WingBlank>
          <Item 
            arrow='horizontal' 
            thumb='https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png'
            onPress={() => {}}
            extra='有100个人看过你'
          >
            历史访客
          </Item>
          <Item
            thumb='https://os.alipayobjects.com/rmsportal/mOoPurdIfmcuqtr.png'
            disabled
            extra={
              <View className='copyExtra' style={{ position: 'relative' }}>
                <Text style={{position: 'absolute', bottom: -8, left: 30}}>aygl</Text>
                <Button style={{position: 'absolute', right: 15, bottom: -16}} type='primary' className='copyButton' onPress={this.copyYqm}>复制</Button>
              </View>
            }
          >
            邀请码
          </Item>
        </List>
      </ScrollView>
    )
  }
}

export default connect(
  ({
    home,
    loading,
  }) => ({
    home,
    loading,
  }),
)(Home);