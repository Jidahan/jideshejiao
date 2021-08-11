import { Component } from 'react';
import NoDataPage from '../../../../components/NoDataPage';

import './index.less';

class Historyvisit extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() { }

  render() {
    return (
      <NoDataPage></NoDataPage>
    )
  }
}

export default Historyvisit