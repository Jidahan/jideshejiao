import { PureComponent } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Toast, Icon } from '@ant-design/react-native'
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import IndexLists from './components/IndexLists'
import NoDataPage from '../../../../components/NoDataPage';
import {
  findHistoricalVisitors,
} from './service';

import './index.less';

class Historyvisit extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      dataArray: [],
      allDataHaveStopLoading: false,
      userId: '',
      isLoading: false,
    }
  }

  componentDidMount() { 
    this.getlikeUserLists()
  }

  getlikeUserLists() {
    const { pageNumber, pageSize } = this.state
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          this.setState({ userId: res.data })
          findHistoricalVisitors({ pageNumber, pageSize, userId: res.data }).then(data => {
            if(data.statusCode === 200){
              if(data.data.data.length === 0) {
                this.setState({
                  allDataHaveStopLoading: true
                })
              }
              this.setState({ dataArray: data.data.data })
            }else{
              Toast.fail({
                content: data.data.msg,
                duration: 2
              })
            }
          }).catch(error => {
            Toast.fail({
              content: `遇到了错误${error}`,
              duration: 2
            })
          })
        }
      }
    })
  }

  _renderItem(data) {
    return (
      <View style={{ marginTop: 10 }}>
        <IndexLists data={data} />
      </View>
    )
  }

  loadData(refresh) {
    if (refresh) {
      const { pageNumber, pageSize, userId } = this.state
      let page = pageNumber + 1
      let dataArray = [];
      findHistoricalVisitors({ pageNumber: page, pageSize, userId }).then(data => {
        if(data.statusCode === 200){
          dataArray = this.state.dataArray.concat(data.data.data);
          this.setState({
            dataArray: dataArray,
            pageNumber: page
          });
          if(data.data.data.length < pageSize){
            this.setState({
              allDataHaveStopLoading: true,
            });
            return
          }
        }else{
          Toast.fail({
            content: data.data.msg,
            duration: 2
          })
        }
      }).catch(error => {
        Toast.fail({
          content: `遇到了错误${error}`,
          duration: 2
        })
      })
    }else{
      this.setState({
        isLoading: true,
        pageNumber: 1
      }, () => {
        const { pageNumber, pageSize, userId } = this.state
        findHistoricalVisitors({pageNumber, pageSize, userId}).then(data => {
          if(data.statusCode === 200){
            this.setState({ dataArray: data.data.data, isLoading: false }, () => {
              this.loadData(true)
            })
          }else{
            this.setState({ isLoading: false })
            Toast.fail({
              content: data.data.msg,
              duration: 2
            })
          }
        }).catch(error => {
          this.setState({ isLoading: false })
          Toast.fail({
            content: `遇到了错误${error}`,
            duration: 2
          })
        })
      });
    }
  }

  genIndicator() {
    if(!this.state.allDataHaveStopLoading){
      return (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator
            style={{ color: 'red', margin: 10 }}
            size='large'
            animating
          />
          <Text>正在加载更多</Text>
        </View>
      )
    }else{
      return (
        <View style={{ alignItems: 'center' }}>
          <Icon name='meh' color='black' style={{ fontSize: 36, margin: 10 }} />
          <Text>已全部加载啦～</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View>
        <FlatList
          keyxtractor={this._keyxtractor}
          data={this.state.dataArray}
          renderItem={(data => this._renderItem(data))}
          // 下拉刷新
          refreshControl={
            <RefreshControl
              title='加载中...'
              colors={['red']}
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData()}
              tintColor='orange'
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            this.loadData(true)
          }}
          onEndReachedThreshold={0.1}
          style={{ marginBottom: 200, height: '100%' }}
        />
      </View>
    )
    // return (
    //   <NoDataPage></NoDataPage>
    // )
  }
}

export default Historyvisit