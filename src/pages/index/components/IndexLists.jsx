import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Flex, WingBlank, Card, Toast } from '@ant-design/react-native'
import { StyleSheet } from 'react-native'
import PositionImg from '../../../images/indexposition.png'
import heartImg from '../../../images/heart.png'
import selectHeatImg from '../../../images/selectHeart.png'
import personImg from '../../../images/person.png'
import startImg from '../../../images/start.png'
import manImg from '../../../images/man.png'
import womenImg from '../../../images/women.png'
import hotImg from '../../../images/hot.png'
import adSumImg from '../../../images/adSum.png'
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
              Toast.success({
                content: data.data.data,
                duration: 1
              })
              Taro.eventCenter.trigger('goLikeUserIsRefresh', {status: true, id: info.userId})
            }else{
              Toast.remove(key)
              Toast.fail({
                content: data.data.msg,
                duration: 2
              })
            }
          })
        } else {
          Toast.fail({
            content: '获取存储数据失败',
            duration: 2
          })
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
                    <Text style={styles.nameStyle}>{item.nickName}</Text>
                    {item.gender === 2 ? 
                      <View className='row' style={{ marginLeft: 5 }}>
                        <Image 
                          style={{ width: 18, height: 18 }}
                          src={womenImg}
                        />
                      </View>
                    :
                      <View className='row' style={{ marginLeft: 5 }}>
                        <Image 
                          style='width: 18px;height: 18px'
                          src={manImg}
                        />
                      </View>
                    }
                  </View>
                  <View className='row' style={{ justifyContent: 'space-between', width: '50%' }}>
                    <Text style={styles.eeeStyle}>{item.city}</Text>
                    <View className='row' style={{ marginLeft: 10 }}>
                      <Image
                        style={{ width: 13, height: 13 }}
                        src={PositionImg}
                      />
                      <Text style={styles.eeeStyle}>{item.distance}</Text>
                    </View>
                    {/* <Text style={{ marginLeft: 5 }}>{item.age}岁{item.constellation}</Text> */}
                  </View>
                  <View className='row' style={{ justifyContent: 'space-between', width: '50%' }}>
                    
                    <View className='row'>
                      <Image src={hotImg} style={styles.hotStyle} />
                      <Text style={{ color: '#d4237a', marginLeft: 2 }}>{item.hotNum}</Text>
                    </View>
                    <View className='row cardContentBottomCenter'>
                      <Image
                        style={styles.adStyle}
                        src={adSumImg}
                      />
                      <Text style={{ color: '#FA8100' }}>{item.individualValues}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className='row cardRightTop'>
                <Text style={{ color: '#121212', marginRight: 5 }}>{item.onlineState === 1 ? '在线' : '离线'}</Text>
                <View className={`onlineOrNoOnlineStyle ${item.onlineState === 1 ? 'online' : 'noOnline'}`}></View>
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

const styles = StyleSheet.create({
  nameStyle: {
    fontSize: 20
  },
  eeeStyle: {
    color: '#868686'
  },
  hotStyle: {
    width: 20,
    height: 20
  },
  adStyle: {
    width: 20,
    height: 20,
    marginLeft: 20
  }
})