import { Component } from 'react';
import Taro from '@tarojs/taro'
import { View, Text, CoverView, CoverImage, Image, ScrollView } from '@tarojs/components'
import { Icon, List, Button, WingBlank, Card, Toast, Flex, Modal, WhiteSpace } from '@ant-design/react-native'
import adImg from '../../images/ad.png'
import headImg from '../../images/1.png'
import manImg from '../../images/man.png'
import womenImg from '../../images/women.png'
import selectHeartImg from '../../images/selectHeart.png'
import goodActionImg from '../../images/goodAction.png'
import startImg from '../../images/start.png'
import photoImg from '../../images/photo.png'
import zwImg from '../../images/zw.png'
import './index.less';

const Item = List.Item;

class Userinfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgArray: []
    }
    this.goBack = this.goBack.bind(this)
    this.goMaPhoto = this.goMaPhoto.bind(this)
  }

  componentDidMount() {
    let imgArray = []
    for(let i = 1; i <= 10; i++) {
      imgArray.push({ id: i })
    }
    this.setState({ imgArray })
  }

  goBack() {
    Taro.navigateBack({
      delta: 2
    })
  }

  goMaPhoto() {
    console.log('123211312');
  }

  render() {
    const { imgArray } = this.state
    const imgArrayHeight = imgArray.length <= 5 ? 80 : 140
    return (
      <View>
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f5f5f9', marginBottom: 100 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className='container'>
            <CoverView className='controls'>
              <CoverImage className='img' src={adImg} />
              <View className='rightTopImgAdd' onClick={this.goBack}>
                <Icon name='left' size='md' className='leftIconGoBack' />
              </View>
              <View className='imgArray'>
                <ScrollView
                  scrollX
                >
                  {imgArray.map(reward => {
                    return (
                      <View style={{width: 50, height: 50, marginLeft: 10}} className={reward.id === 0 ? 'selectImgArrayOneImg' : ''} key={reward.id}>
                        <Image
                          style={{width: '100%', height: '100%', borderRadius: 10}}
                          src={headImg}
                        />
                      </View>
                    )
                  })}
                </ScrollView>
              </View>
              <View className='bottomTwoText'>
                <Image src={womenImg} className='iconSizeStyle' style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 2 }}>她已通过女神认证</Text>
              </View>
              {/* <View className='bottomTwoText'>
                <Image src={manImg} className='iconSizeStyle' style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 2 }}>他已通过男神认证</Text>
              </View> */}
              <View className='bottomText'>
                <Icon name='alert' size='md' color='#efb336' />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>她已通过真人面容认证</Text>
              </View>
            </CoverView>
          </View>
          <List style={{ marginTop: 10 }}>
            <Item 
              arrow='' 
              thumb={null}
              extra={
                <View className='copyExtra' style={{ position: 'relative' }}>
                  <Image 
                    src={selectHeartImg} 
                    style={{width: 30, height: 30, position: 'absolute', right: 60, top: -15}}
                  />
                  <Text style={{position: 'absolute', bottom: -8, right: 10}}>已关注</Text>
                </View>
              }
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Text>柳岩</Text>
                <View style={{ marginLeft: 10 }}>
                  <Icon name='environment' size='md' style={{ color: '#d4237a' }} />
                </View>
                <Text style={{ color: '#8a8a8a' }}>110m 离线</Text>
              </View>
            </Item>

            <Item 
              arrow='' 
              thumb={null}
              extra={null}
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Text>广州市</Text>
                <Text style={{ marginLeft: 10 }}>18岁</Text>
                <Text style={{ marginLeft: 10 }}>金牛座</Text>
              </View>
            </Item>

            <Item 
              arrow='' 
              thumb={null}
              extra={null}
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Image 
                  src={goodActionImg} 
                  style={{width: 28, height: 28}}
                />
                <Text style={{ marginLeft: 10 }}>好评 1</Text>
                <Image
                  src={startImg}
                  style={{width: 28, height: 28, marginLeft: 15}}
                />
                <Text style={{ marginLeft: 10 }}>爱豆 199</Text>
              </View>
            </Item>
            <WingBlank size='lg'>
              <Card>
                <Card.Header
                  title='她的相册'
                  thumbStyle={{ width: 30, height: 30 }}
                  thumb={
                    <Image src={photoImg} className='iconSizeStyle' />
                  }
                  extra={
                    <Item arrow='horizontal' 
                      onPress={this.goMaPhoto} 
                    >
                      <Text style={{ fontSize: 18, marginLeft: 60 }}>更多</Text>
                    </Item>
                  }
                />
                <Card.Body style={{ height: imgArrayHeight, overflow: 'hidden' }}>
                  <View style={{ height: 42, display: 'flex', flexDirection: 'row', marginTop: -5 }}>
                  <WingBlank>
                    <Flex wrap='wrap'>
                      {imgArray
                        .map((reward) => {
                          return <Image
                            style={{width: 60, height: 60, marginLeft: 5, borderRadius: 5, marginBottom: 10 }}
                            src={headImg}
                            key={reward.id}
                            className='filterImg'
                          />
                      })}
                    </Flex>
                  </WingBlank>
                  </View>
                </Card.Body>
              </Card>
            </WingBlank>
          </List>
        </ScrollView>
      </View>
    )
  }
}

export default Userinfo
// 下面用来connect数据层
// export default connect(
//   ({
//     userInfo,
//   }) => ({
//     userInfo,
//   }),
// )(Userinfo);
