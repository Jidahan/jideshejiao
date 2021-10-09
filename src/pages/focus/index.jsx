import { PureComponent } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { Toast, Icon, Card } from '@ant-design/react-native'
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import IndexLists from './components/IndexLists'

import './index.less'
import {
  myFollowList,
} from './service'


class Focus extends PureComponent {

  _keyxtractor = (item, index) => item.id

  constructor(props) {
    super(props)
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      dataArray: [],
      allDataHaveStopLoading: false,
      userId: '',
      isLoading: false,
    },
    this.cardGoUserInfo = this.cardGoUserInfo.bind(this)
  }

  componentDidMount () { 
    this.getlikeUserLists()
    this.refreshData()
  }

  onTabItemTap() {
    this.setState({ pageNumber: 1 }, () => {
      this.getlikeUserLists()
      this.refreshData()
    })
  }

  // componentDidShow() {
  //   this.setState({ pageNumber: 1 }, () => {
  //     this.getlikeUserLists()
  //     this.refreshData()
  //   })
  // }

  refreshData() {
    Taro.eventCenter.on('deleteLikeUser',(arg)=>{
      if(arg?.status){
        const likenowData = this.state.dataArray.filter(reward => {
          return reward.userId !== arg.id
        })
        this.setState({ dataArray: likenowData })
      }
    })
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
      <IndexLists data={data} />
    )
  }

  loadData(refresh) {
    if (refresh) {
      const { pageNumber, pageSize, userId } = this.state
      let page = pageNumber + 1
      let dataArray = [];
      myFollowList({ pageNumber: page, pageSize, userId }).then(data => {
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
        myFollowList({pageNumber, pageSize, userId}).then(data => {
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
          <Icon name='meh' color='black' style={{ fontSize: 28, margin: 10 }} />
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
          style={{ marginBottom: 200, height: '90%' }}
          onEndReachedThreshold={0.1}
        />
      </View>
    )
  }
}

export default Focus;