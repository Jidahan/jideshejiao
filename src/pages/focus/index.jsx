import { PureComponent } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { Toast, Icon, Card } from '@ant-design/react-native'
import { FlatList, ActivityIndicator } from 'react-native'
import IndexLists from './components/IndexLists'

import './index.less'
import {
  myFollowList,
} from './service'


class Focus extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      dataArray: [],
      allDataHaveStopLoading: false,
      userId: ''
    },
    this.cardGoUserInfo = this.cardGoUserInfo.bind(this)
  }

  componentDidMount () { 
    this.getlikeUserLists()
  }

  getlikeUserLists() {
    const { pageNumber, pageSize } = this.state
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          this.setState({ userId: res.data })
          myFollowList({ pageNumber, pageSize, userId: res.data }).then(data => {
            if(data.statusCode === 200){
              this.setState({ dataArray: data.data.data })
            }else{
              Toast.fail(data.data.msg)
            }
          })
        }
      }
    })
  }

  _renderItem(data) {
    return (
      <IndexLists data={data} />
    )
  }

  loadData(refresh) {
    if (refresh) {
      // this.setState({
      //   isLoading: true
      // });
      const { pageNumber, pageSize, userId } = this.state
      let page = pageNumber + 1
      let dataArray = [];
      myFollowList({ pageNumber, pageSize, userId }).then(data => {
        if(data.statusCode === 200){
          if(data.data.data.length === 0){
            this.setState({
              allDataHaveStopLoading: true,
            });
            return
          }
          dataArray = this.state.dataArray.concat(data.data.data);
          this.setState({
            dataArray: dataArray,
            // isLoading: false,
            pageNumber: page
          });
        }else{
          Toast.fail(data.data.msg)
        }
      })
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

  cardGoUserInfo(info) {
    Taro.navigateTo({
      url: `/pages/userInfo/index?id=${info.id}`
    })
  }

  render () {
    return (
      <View>
        <FlatList
          data={this.state.dataArray}
          renderItem={(data => this._renderItem(data))}
          // 下拉刷新
          // refreshControl={
          //   <RefreshControl
          //     title='Loading...'
          //     colors={['red']}
          //     refreshing={this.state.isLoading}
          //     onRefresh={() => this.loadData()}
          //     tintColor='orange'
          //   />
          // }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            this.loadData(true)
          }}
          style={{ marginBottom: 200, height: '100%' }}
        />
      </View>
    )
  }
}

export default Focus;