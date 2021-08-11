import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { Flex, WingBlank, Card } from '@ant-design/react-native'
import './index.less'
import PositionImg from '../../images/position.png'
import heartImg from '../../images/heart.png'
import selectHeatImg from '../../images/selectHeart.png'
import personImg from '../../images/person.png'
import startImg from '../../images/start.png'
import manImg from '../../images/man.png'
import womenImg from '../../images/women.png'
import headImg from '../../images/1.png'

class Focus extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cardList: [
        {id:1, focus: true}, 
        {id:2, focus: false}
      ]
    },
    this.cardGoUserInfo = this.cardGoUserInfo.bind(this)
  }

  componentDidMount () { 
    let cardData = []
    for(let i = 0; i <= 20; i++){
      cardData.push({id: i, focus: Math.random() >= 0.5}, )
    }
    this.setState({ cardList: cardData })
  }

  componentWillUnmount () { }

  cardGoUserInfo(info) {
    Taro.navigateTo({
      url: `/pages/userInfo/index?id=${info.id}`
    })
  }

  render () {
    const { cardList } = this.state
    return (
      <View className='index'>
        <ScrollView
          style={{ flex: 1, marginBottom: 100 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          scrollWithAnimation
          enableBackToTop
        >
          <WingBlank style={{ marginBottom: 5 }}>
            <Flex direction='column' justify='around'>
              {cardList.map(reward => {
                return (
                  <Card style={{ width: '100%', marginTop: 20 }} key={reward.id}>
                    <Card.Body style={{ padding: 10 }}>
                      <View className='cardBody' onClick={() => this.cardGoUserInfo(reward)}>
                        <View className='cardBodyLeft'>
                          <Image
                            style={{width: 80, height: 80, borderRadius: 10}}
                            src={headImg}
                          />
                          <View className='cardCenterContent'>
                            <View className='row'>
                              <Text>北极星小姐姐</Text>
                              {reward.focus ? 
                                <View className='row' style={{ marginLeft: 5 }}>
                                  <Image 
                                    style='width: 18px;height: 18px'
                                    src={womenImg}
                                  />
                                  <Text style={{ color: '#d4237a' }}>女神</Text>
                                </View>
                              :
                                <View className='row' style={{ marginLeft: 5 }}>
                                  <Image 
                                    style='width: 18px;height: 18px'
                                    src={manImg}
                                  />
                                  <Text style={{ color: '#1296db' }}>男神</Text>
                                </View>
                              }
                            </View>
                            <View className='row' style={{ justifyContent: 'space-between' }}>
                              <Text>大连市</Text>
                              <Text>15岁金牛座</Text>
                              <Text style={{ color: '#d4237a' }}>热度 8888</Text>
                            </View>
                            <View className='row' style={{ justifyContent: 'space-between' }}>
                              <View className='row cardContentBottomLeft'>
                                <Image
                                  style='width: 18px;height: 18px'
                                  src={PositionImg}
                                />
                                <Text>430m</Text>
                              </View>
                              <View className='row cardContentBottomCenter'>
                                <Image
                                  style='width: 25px;height: 25px'
                                  src={personImg}
                                />
                                <Text style={{ color: '#ccc' }}>离线</Text>
                              </View>
                              <View className='row cardContentBottomCenter'>
                                <Image
                                  style='width: 18px;height: 18px'
                                  src={startImg}
                                />
                                <Text>爱豆 888</Text>
                              </View>
                              
                            </View>
                          </View>
                        </View>
                        
                        <View>
                          {reward.focus ? 
                            <Image src={selectHeatImg} style={{width: 25, height: 25, borderRadius: 10}} />
                          :
                            <Image src={heartImg} style={{width: 25, height: 25, borderRadius: 10}} />
                          }
                        </View>
                      </View>
                    </Card.Body>
                  </Card>
                )
              })}
            </Flex>
          </WingBlank>
        </ScrollView>
      </View>
    )
  }
}

export default Focus;