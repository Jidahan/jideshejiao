import { PureComponent } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Icon, WhiteSpace, Button, SearchBar, Toast } from '@ant-design/react-native'
import { FlatList, ActivityIndicator } from 'react-native';
import IndexLists from './components/IndexLists'
import { 
  appUserList,
} from './service'
import PositionImg from '../../images/position.png'
import adImg from '../../images/ad.png'
import './index.less'

class Index extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      pageNumber: 1,
      pageSize: 10,
      city: '西安',
      dataArray: [],
      // isLoading: false,
      latitude: '34.343147',
      longitude: '108.939621',
      range: 10,
      allDataHaveStopLoading: false
    },
    this.adClick = this.adClick.bind(this)
    this.searchOnChange = this.searchOnChange.bind(this)
    this.searchOnCancelChange = this.searchOnCancelChange.bind(this)
    this.goCitySelect = this.goCitySelect.bind(this)
  }
  
  componentDidMount () {
    this.getUserLists()
    // Taro.eventCenter.on('goLikeUserIsRefresh',(arg)=>{
    //   if(arg){
    //     this.getUserLists()
    //   }
    // })
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
              Toast.fail(data.data.msg)
            }
          })
        }
      }
    })
    
  }

  adClick() {
    console.log('点击ad广告');
    // Taro.navigateTo({
    //   url: 'https://www.baidu.com'
    // })
  }

  goCitySelect() {
    console.log('12323');
    Taro.navigateTo({
      url: `/pages/citySelect/index`
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
      // this.setState({
      //   isLoading: true
      // });
      const { city, pageNumber, pageSize, latitude, longitude, range } = this.state
      let page = pageNumber + 1
      let dataArray = [];
      appUserList({city, pageNumber: page, pageSize, latitude, longitude, range, userId: 90}).then(data => {
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


  render () {
    return (
      <View className='bodyOut'>
        <View className='topSearch'>
          <View style={{ width: '70%', position:'relative' }}>
            <SearchBar defaultValue='初始值' placeholder='搜索' style={{ position: 'absolute', top: -22, bottom: 0, left: -10, height: '100%', width: '110%', border: 'none' }} onChange={this.searchOnChange} onCancel={this.searchOnCancelChange} value={this.state.searchValue} />
          </View>
          <View>
            <Button size='small' className='searchRightButton' onPress={this.goCitySelect}>
              <View>
                <Text className='searchRightButtonText'>附近</Text>
              </View>
              <Image
                style='width: 20px;height: 20px'
                src={PositionImg}
              />
            </Button>
          </View>
        </View>
        <WhiteSpace size='xl' />
        <View style={{ padding: 20, paddingTop: 0, paddingBottom: 0 }}>
          <Image
            style={{width: '100%', height: 120, borderRadius: 10}}
            src={adImg}
            onClick={this.adClick}
          />
        </View>
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
            style={{ marginBottom: 200, height: 500 }}
          />

        </View>

      </View>
    )
  }
}

export default Index
  