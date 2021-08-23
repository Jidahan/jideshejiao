import { Component } from 'react';
import { WebView } from '@tarojs/components';

import './index.less';

class Adpage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }

  componentDidMount() { 
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