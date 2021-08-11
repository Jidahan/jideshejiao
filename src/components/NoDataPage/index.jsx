import { Component } from 'react';
import { View, Image } from '@tarojs/components'
import { Result } from '@ant-design/react-native'
import nodataImg from '../../images/noData.png'
import './index.less';

class NoDataPage extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() { }

  render() {
    return (
      <View className='bodyStyle'>
        <Result img={
          <Image src={nodataImg} style={{ width: 80, height: 80 }} />
        } title='暂无数据～' message=''
        />
      </View>
    )
  }
}

export default NoDataPage
// 下面用来connect数据层
// export default connect(
//   ({
//     historyVisit,
//   }) => ({
//     historyVisit,
//   }),
// )(Historyvisit);
