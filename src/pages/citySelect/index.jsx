import { Component } from 'react';
import { View } from '@tarojs/components';
import { connect } from 'react-redux';
import './index.less';

class Cityselect extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() { }

  render() {
    return (
      <View className="citySelect-page">
        citySelect
      </View>
    )
  }
}

export default Cityselect
// 下面用来connect数据层
// export default connect(
//   ({
//     citySelect,
//   }) => ({
//     citySelect,
//   }),
// )(Cityselect);
