import { PureComponent } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Icon, WhiteSpace, Button, SearchBar, Toast } from '@ant-design/react-native'
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet, TextInput } from 'react-native';
import IndexLists from './components/IndexLists'
import { 
  appUserList,
} from './service'
import PositionImg from '../../images/position.png'
import AdLists from './components/AdLists'
import searchImg from '../../images/search.png'
import './index.less'

class Index extends PureComponent {

  _keyxtractor = (item, index) => item.id

  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      pageNumber: 1,
      pageSize: 10,
      city: '西安',
      dataArray: [],
      isLoading: false,
      latitude: '34.343147',
      longitude: '108.939621',
      range: 10,
      allDataHaveStopLoading: false,
    },
    this.searchOnChange = this.searchOnChange.bind(this)
    this.searchOnCancelChange = this.searchOnCancelChange.bind(this)
    this.goCitySelect = this.goCitySelect.bind(this)
  }
  
  componentDidMount () {
    this.getUserLists()
    this.refreshData()
    this.updateCity()
    // const that = this
    // Taro.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     that.setState({
    //       latitude,
    //       longitude,
    //     })
    //     Taro.request({
    //       url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=XKYBZ-36R6D-DP74D-PFWPH-PICQ5-RHFJS`,
    //       header: {
    //         'Content-Type': 'application/json',
    //       },
    //       method: 'GET',
    //       complete: (resCity) => {
    //         if (resCity.statusCode === 200) {
    //           const city = resCity.data.result.address_component.city.split('市')[0]
    //           that.setState({ 
    //             city
    //           },() => {
    //             that.getUserLists()
    //             that.refreshData()
    //             that.updateCity()
    //           })
    //         }else{
    //           Toast.fail('定位失败')
    //           that.setState({ isLoading: false })
    //         }
    //       },
    //     })
    //   },
    //   error: function(error) {
    //     console.log(error);
    //   }
    // })
  }

  updateCity() {
    Taro.eventCenter.on('updateCity',(arg)=>{
      if(arg?.status){
        this.setState({ city: arg?.city, pageNumber: 1 }, () => {
          this.getUserLists()
          this.refreshData()
        })
      }
    })
  }

  refreshData() {
    Taro.eventCenter.on('goLikeUserIsRefresh',(arg)=>{
      if(arg?.status){
        const likenowData = this.state.dataArray.map(reward => {
          if(reward.userId === arg?.id){
            reward.collectionIs = reward.collectionIs === 1 ? 2 : 1
          }
          return reward
        })
        this.setState({ dataArray: likenowData })
        Taro.eventCenter.trigger('goLikeUserIsRefresh', {status: false, id: ''})
      }
    })
  }

  getUserLists() {    
    const { city, pageNumber, pageSize, latitude, longitude, range } = this.state
    Taro.getStorage({
      key: 'userId',
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          appUserList({city, pageNumber, pageSize, latitude, longitude, range, userId: res.data}).then(data => {
            if(data.statusCode === 200){
              this.setState({ dataArray: data.data.data })
            }else{
              Toast.fail({
                content: data.data.msg,
                duration: 2
              })
            }
          })
        }else{
          Taro.redirectTo({
            url: `pages/login/index`,
          })
        }
      },
      error: () => {
        Taro.redirectTo({
          url: `pages/login/index`,
        })
      }
    })
  }

  goCitySelect() {
    Taro.navigateTo({
      url: `/pages/citySelect/index`,
    })
  }

  searchOnChange(val) {
    console.log(val);
    this.setState({ searchValue: val })
  }

  searchOnCancelChange(val) {
    this.setState({ searchValue: '' })
  }

  _renderItem(data) {
    return (
      <IndexLists data={data} />
    )
  }

  loadData(refresh) {
    if (refresh) {
      const { city, pageNumber, pageSize, latitude, longitude, range } = this.state
      let page = pageNumber + 1
      let dataArray = [];
      Taro.getStorage({
        key: 'userId',
        complete: (res) => {
          if (res.errMsg === "getStorage:ok") {
            appUserList({city, pageNumber: page, pageSize, latitude, longitude, range, userId: res.data}).then(data => {
              if(data.statusCode === 200){
                if(data.data.data.length < pageSize){
                  this.setState({
                    allDataHaveStopLoading: true,
                  });
                  return
                }
                dataArray = this.state.dataArray.concat(data.data.data);
                this.setState({
                  dataArray: dataArray,
                  pageNumber: page
                });
              }else{
                Toast.fail({
                  content: data.data.msg,
                  duration: 2
                })
              }
            })
          }
        }
      })
    }else{
      this.setState({
        isLoading: true,
        pageNumber: 1
      }, () => {
        const { city, pageNumber, pageSize, latitude, longitude, range } = this.state
        Taro.getStorage({
          key: 'userId',
          complete: (res) => {
            if (res.errMsg === "getStorage:ok") {
              appUserList({city, pageNumber, pageSize, latitude, longitude, range, userId: res.data}).then(data => {
                if(data.statusCode === 200){
                  this.setState({ dataArray: data.data.data, isLoading: false })
                }else{
                  this.setState({ isLoading: false })
                  Toast.fail({
                    content: data.data.msg,
                    duration: 2
                  })
                }
              })
            }
          }
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


  render () {
    return (
      <View className='bodyOut'>
        <View className='topSearch' style={{ height: '13%' }}>
          <View style={{ width: '70%', position:'relative' }}>
            <SearchBar placeholder='输入昵称搜索' style={{ position: 'absolute', top: -18, bottom: 0, left: -10, height: '80%', width: '110%', borderRadius: 20, backgroundColor: '#E8E8E8' }} onChange={this.searchOnChange} onCancel={this.searchOnCancelChange} value={this.state.searchValue} />
          </View>
          <View onClick={this.goCitySelect} style={styles.position}>
            <Image
              style={{ width: 20, height: 20 }}
              src={PositionImg}
            />
            <Text className='searchRightButtonText'>附近</Text>
          </View>
        </View>
        <View style={{ padding: 20, paddingTop: 0, paddingBottom: 0 }}>
          <AdLists />
        </View>
        <View style={{ marginBottom: 50, height: '60%' }}>
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
            style={{ height: '100%' }}
          />

        </View>

      </View>
    )
  }
}

export default Index

const styles = StyleSheet.create({
  position: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})