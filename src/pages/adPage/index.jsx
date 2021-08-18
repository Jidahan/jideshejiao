import { Component } from 'react';
import { View, WebView } from '@tarojs/components';
import { connect } from 'react-redux';

import './index.less';

class Adpage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  componentDidMount() { 
    console.log(this.props);
    this.setState({ url: `https://`+this.props.route.params.url })
  }

  render() {
    const { url } = this.state
    return (
      <WebView src={url} />
    )
  }
}

export default Adpage
// 下面用来connect数据层
// export default connect(
//   ({
//     adPage,
//   }) => ({
//     adPage,
//   }),
// )(Adpage);
