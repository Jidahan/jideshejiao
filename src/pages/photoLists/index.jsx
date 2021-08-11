import { Component } from 'react';
import { View, Image, ScrollView } from '@tarojs/components';
import { Flex, WhiteSpace, WingBlank } from '@ant-design/react-native'
import headImg from '../../images/1.png'
import './index.less';

class Photolists extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cardList: [
        {id:1, focus: true}, 
        {id:2, focus: false}
      ]
    }
  }

  componentDidMount() {
    let cardData = []
    for(let i = 0; i <= 20; i++){
      cardData.push({id: i, focus: Math.random() >= 0.5}, )
    }
    this.setState({ cardList: cardData })
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
                return (
                  <View style={{width: 100, height: 100, marginBottom: 10}} key={reward.id}>
                    <Image
                      style={{width: '100%', height: '100%', borderRadius: 10}}
                      src={headImg}
                    />
                  </View>
                )
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
