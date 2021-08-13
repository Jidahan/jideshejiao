import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Flex, WhiteSpace, WingBlank, Button, Card, SearchBar, Toast } from '@ant-design/react-native'

import PositionImg from '../../../images/position.png'
import heartImg from '../../../images/heart.png'
import selectHeatImg from '../../../images/selectHeart.png'
import personImg from '../../../images/person.png'
import startImg from '../../../images/start.png'
import manImg from '../../../images/man.png'
import womenImg from '../../../images/women.png'
import { 
  collectionUser,
} from '../service'
import '../index.less'

const IndexLists = (props) => {
  const { data:{ item } } = props

  const cardGoUserInfo = (info) => {
    Taro.navigateTo({
      url: `/pages/userInfo/index?id=${info.userId}`
    })
  }

  const likeUser = (info, e) => {
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          const key = Toast.loading('')
          collectionUser({otherUserId: info.userId, userId: Number(res.data)}).then(data => {
            if(data.data.status === 200){
              Toast.remove(key)
              Toast.success(data.data.data)
              // Taro.eventCenter.trigger('goLikeUserIsRefresh', true)
              // setTimeout(() => {
              //   Taro.eventCenter.trigger('goLikeUserIsRefresh', false)
              // }, 10);
            }else{
              Toast.remove(key)
              Toast.fail(data.data.data)
            }
          })
        } else {
          console.log('获取存储数据失败');
        }
      }
    })
  }

  return (
    <WingBlank style={{ marginBottom: 5 }}>
      <Flex direction='column' justify='around'>
        <Card style={{ width: '100%', marginTop: 10 }} key={item.id}>
          <Card.Body style={{ padding: 10 }}>
            <View className='cardBody' onClick={() => cardGoUserInfo(item)}>
              <View className='cardBodyLeft'>
                <Image
                  style={{width: 80, height: 80, borderRadius: 10}}
                  src={item.photo}
                />
                <View className='cardCenterContent'>
                  <View className='row'>
                    <Text>{item.nickName}</Text>
                    {item.gender === 2 ? 
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
                    <Text>{item.city}</Text>
                    <Text style={{ marginLeft: 5 }}>{item.age}岁{item.constellation}</Text>
                    <Text style={{ color: '#d4237a', marginLeft: 5 }}>热度 {item.hotNum}</Text>
                  </View>
                  <View className='row' style={{ justifyContent: 'space-between', width: '50%' }}>
                    <View className='row cardContentBottomLeft'>
                      <Image
                        style={{ width: 13, height: 13 }}
                        src={PositionImg}
                      />
                      <Text>{item.distance}</Text>
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
                      <Text>爱豆 {item.individualValues}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View className='cardRightHeat'>
                {item.collectionIs === 1 ? 
                  <Image src={selectHeatImg} style={{width: 25, height: 25}} onClick={(e) => likeUser(item, e)} />
                :
                  <Image src={heartImg} style={{width: 25, height: 25}} onClick={(e) => likeUser(item, e)} />
                }
              </View>
            </View>
          </Card.Body>
        </Card>
      </Flex>
    </WingBlank>
  )
}

export default IndexLists