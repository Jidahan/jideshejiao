import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { Flex, WhiteSpace, WingBlank, Button, Card, SearchBar, Toast } from '@ant-design/react-native'
import { TextInput } from 'react-native'
import { 
  appUserList,
} from './service'

import PositionImg from '../../images/position.png'
import adImg from '../../images/ad.png'
import heartImg from '../../images/heart.png'
import selectHeatImg from '../../images/selectHeart.png'
import personImg from '../../images/person.png'
import startImg from '../../images/start.png'
import manImg from '../../images/man.png'
import womenImg from '../../images/women.png'
import headImg from '../../images/1.png'

import './index.less'

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cardList: [],
      searchValue: ''
    },
    this.adClick = this.adClick.bind(this)
    this.cardGoUserInfo = this.cardGoUserInfo.bind(this)
    this.likeUser = this.likeUser.bind(this)
    this.searchOnChange = this.searchOnChange.bind(this)
    this.searchOnCancelChange = this.searchOnCancelChange.bind(this)
    this.goCitySelect = this.goCitySelect.bind(this)
  }
  
  componentDidMount () {
    this.getUserLists()
  }

  getUserLists() {
    const key = Toast.loading('加载中...');
    appUserList({city: '西安', pageNumber: 1, pageSize: 10}).then(data => {
      if(data.statusCode === 200){
        this.setState({ cardList: data.data.data.records })
        Toast.remove(key);
      }else{
        Toast.fail(data.data.msg)
      }
    })
  }

  componentWillUnmount () { }

  adClick() {
    console.log('点击ad广告');
    // Taro.navigateTo({
    //   url: 'https://www.baidu.com'
    // })
  }

  goCitySelect() {
    console.log('12323');
    Taro.navigateTo({
      url: `/pages/citySelect/index`
    })
  }

  cardGoUserInfo(info) {
    Taro.navigateTo({
      url: `/pages/userInfo/index?id=${info.id}`
    })
  }

  likeUser(info, e) {
    console.log(e);
    console.log('8888');
  }

  searchOnChange(val) {
    console.log(val);
    this.setState({ searchValue: val })
  }

  searchOnCancelChange(val) {
    this.setState({ searchValue: '' })
  }

  render () {
    const { cardList } = this.state

    return (
      <View className='bodyOut'>
        <View className='topSearch'>
          <View style={{ width: '70%', position:'relative' }}>
            <SearchBar defaultValue='初始值' placeholder='搜索' style={{ position: 'absolute', top: -22, bottom: 0, left: -10, height: '100%', width: '110%', border: 'none' }} onChange={this.searchOnChange} onCancel={this.searchOnCancelChange} value={this.state.searchValue} />
          </View>
          {/* <View>
            <TextInput 
              type='text' 
              placeholder='输入昵称搜索' 
              focus 
              className='searchInput'
              keyboardType='web-search'
            />
          </View> */}
          <View>
            <Button size='small' className='searchRightButton' onPress={this.goCitySelect}>
              <View>
                <Text className='searchRightButtonText'>附近</Text>
              </View>
              <Image
                style='width: 20px;height: 20px'
                src={PositionImg}
              />
            </Button>
          </View>
        </View>
        <ScrollView
          style={{ flex: 1, marginBottom: 100 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          scrollWithAnimation
          enableBackToTop
        >
          <WhiteSpace size='xl' />
            <WingBlank style={{ marginBottom: 5 }}>
              <Flex direction='column' justify='around'>
                <Image
                  style={{width: '100%', height: 120, borderRadius: 10}}
                  src={adImg}
                  onClick={this.adClick}
                />
                {cardList.map(reward => {
                  return (
                    <Card style={{ width: '100%', marginTop: 20 }} key={reward.id}>
                      <Card.Body style={{ padding: 10 }}>
                        <View className='cardBody' onClick={() => this.cardGoUserInfo(reward)}>
                          <View className='cardBodyLeft'>
                            <Image
                              style={{width: 80, height: 80, borderRadius: 10}}
                              src={reward.photo}
                            />
                            <View className='cardCenterContent'>
                              <View className='row'>
                                <Text>{reward.nickName}</Text>
                                {reward.gender === 2 ? 
                                  <View className='row' style={{ marginLeft: 5 }}>
                                    <Image 
                                      style={{ width: 18, height: 18 }}
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
                              <View className='row' style={{ justifyContent: 'space-between', width: '50%' }}>
                                <Text>{reward.city}</Text>
                                <Text style={{ marginLeft: 5 }}>{reward.age}岁金牛座</Text>
                                <Text style={{ color: '#d4237a', marginLeft: 5 }}>热度 8888</Text>
                              </View>
                              <View className='row' style={{ justifyContent: 'space-between', width: '50%' }}>
                                <View className='row cardContentBottomLeft'>
                                  <Image
                                    style={{ width: 13, height: 13 }}
                                    src={PositionImg}
                                  />
                                  <Text>430m</Text>
                                </View>
                                <View className='row cardContentBottomCenter' style={{ zIndex: 99 }}>
                                  <Image
                                    style={{ width: 13, height: 13 }}
                                    src={personImg}
                                  />
                                  <Text style={{ color: '#ccc' }}>离线</Text>
                                </View>
                                <View className='row cardContentBottomCenter'>
                                  <Image
                                    style={{ width: 13, height: 13 }}
                                    src={startImg}
                                  />
                                  <Text>爱豆 {reward.individualValues}</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                          
                          <View className='cardRightHeat'>
                            {reward.focus ? 
                              <Image src={selectHeatImg} style={{width: 25, height: 25}} onClick={(e) => this.likeUser(reward, e)} />
                            :
                              <Image src={heartImg} style={{width: 25, height: 25}} onClick={(e) => this.likeUser(reward, e)} />
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

export default Index
  