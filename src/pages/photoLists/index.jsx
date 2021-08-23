import { Component } from 'react';
import { View, Image, ScrollView, Video } from '@tarojs/components';
import { Flex, WhiteSpace, WingBlank } from '@ant-design/react-native'
import './index.less';

class Photolists extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cardList: []
    }
  }

  componentDidMount() {
    const { route:{params:{data}} } = this.props
    this.setState({ cardList: data&&JSON.parse(data) })
  }

  render() {
    const {cardList} = this.state
    return (
      <ScrollView className='photoLists-page'>
        <WhiteSpace size='sm' />
        <WingBlank style={{ marginBottom: 5 }}>
          <Flex direction='row' justify='between' wrap='wrap'>
            {
              cardList.map(reward => {
                if(reward.type === 1){
                  return (
                    <View style={{width: 100, height: 100, marginBottom: 10}} key={reward.id}>
                      <Image
                        style={{width: '100%', height: '100%', borderRadius: 10}}
                        src={reward.src}
                      />
                    </View>
                  )
                }else{
                  return (
                    <View style={{width: 100, height: 100, marginBottom: 10}} key={reward.id}>
                      <Video
                        style={{width: '100%', height: '100%', borderRadius: 10}}
                        src={reward.url}
                        autoplay={false}
                        loop={false}
                        poster={reward.videoUrl}
                        // controls={false}
                        showCenterPlayBtn={false}
                        // objectFit='fill'
                      />
                    </View>
                  )
                }
              })
            }
          </Flex>
        </WingBlank>
      </ScrollView>
    )
  }
}

export default Photolists
// 下面用来connect数据层
// export default connect(
//   ({
//     photoLists,
//   }) => ({
//     photoLists,
//   }),
// )(Photolists);
