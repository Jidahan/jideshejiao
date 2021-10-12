import React, {Component} from "react"
import Taro from '@tarojs/taro';
import { connect } from 'react-redux'
import { Modal, Toast } from '@ant-design/react-native';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight} from 'react-native';
import cityDatas from "./cityIndex";

const {width, height} = Dimensions.get('window');
// 适配性函数
const UIWIDTH = 750;

let hotCitys = [];
let defaultHotCityArray = [
  {cityCode: "310000", cityName: "上海市"},
  {cityCode: "440300", cityName: "深圳市"},
  {cityCode: "110000", cityName: "北京市"},
  {cityCode: "440100", cityName: "广州市"},
  {cityCode: "610100", cityName: "西安市"},
];

const sectionWidth = 20;
const statusHeight = 88;
const sectionTopBottomHeight = 60;
const sectionItemHeight = (height - sectionTopBottomHeight * 2 - statusHeight) / cityDatas.length;
const ROW_HEIGHT = 48;

let totalHeight = [];
export function rx(UIPX) {
  return Math.round(UIPX * width / UIWIDTH);
}

class cityList extends Component {
  constructor(props) {
    super(props);
    totalHeight = this._gotTotalHeightArray();
    letters = this._gotLettersArray();
  }

  state = {
    currentCity: "正在定位...",
  };

  UNSAFE_componentWillMount() {
    this.gotCurrentLocation();
    this.requestHotCityList();
  }

  //总的处理选择城市事件
  selectEndResultCity(cityName) {
    const { home:{isPersonPageGo} } = this.props
    if(isPersonPageGo){
      if(cityName === '附近') return
    }
    if(cityName === '正在定位...' || cityName === '定位失败，重新定位'){
      const that = this
      Taro.getLocation({
        type: 'wgs84',
        success: function (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          Taro.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=XKYBZ-36R6D-DP74D-PFWPH-PICQ5-RHFJS`,
            header: {
              'Content-Type': 'application/json',
            },
            method: 'GET',
            complete: (res) => {
              if (res.statusCode === 200) {
                const city = res.data.result.address_component.city.split('市')[0]
                that.setState({ 
                  currentCity: city
                })
              }else{
                Toast.fail({
                  content: '定位失败',
                  duration: 1
                })
                that.setState({ 
                  currentCity: '定位失败，重新定位'
                })
              }
            },
          })
        }
      })
      return
    }
    const that = this
    Taro.navigateBack({
      delta: 1,
      success: function () {
        console.log('isPersonPageGo', isPersonPageGo);
        if(isPersonPageGo){
          that.props.dispatch({
              type: 'home/editPersonPageGoStatus',
              payload: false
          }).then(() => {
            Taro.eventCenter.trigger('updatePersonInfoPageCity', {status: true, city: cityName})
          })
        }else{
          Taro.eventCenter.trigger('updateCity', {status: true, city: cityName})
        }
      }
    })
  }

  // 获取每个字母区域的高度
  _gotTotalHeightArray() {
    let totalArray = []
    for (let i = 0; i < cityDatas.length; i++) {
      let eachHeight = ROW_HEIGHT * (cityDatas[i].data.length + 1);
      totalArray.push(eachHeight);
    }
    return totalArray
  }

  // 获取字母列表头
  _gotLettersArray() {
    let LettersArray = []
    for (let i = 0; i < cityDatas.length; i++) {
      let element = cityDatas[i];
      LettersArray.push(element.title)
    }
    return LettersArray
  }

  async gotCurrentLocation() {
    Taro.getStorage({
      key: 'positionCity',
      complete: (res) => {
        if (res.errMsg !== "getStorage:ok") {
          const that = this
          Taro.getLocation({
            type: 'wgs84',
            success: function (latlog) {
              const latitude = latlog.latitude
              const longitude = latlog.longitude
              Taro.request({
                url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=XKYBZ-36R6D-DP74D-PFWPH-PICQ5-RHFJS`,
                header: {
                  'Content-Type': 'application/json',
                },
                method: 'GET',
                complete: (result) => {
                  if (result.statusCode === 200) {
                    const city = result.data.result.address_component.city.split('市')[0]
                    Taro.setStorage({
                      key: "positionCity",
                      data: city
                    })
                    that.setState({
                      currentCity: city,
                    })
                  }else{
                    Toast.fail({
                      content: '定位失败',
                      duration: 1
                    })
                    that.setState({
                      currentCity: '定位失败，重新定位'
                    })
                  }
                },
              })
            }
          })
        }else{
          this.setCurrentLocation(res.data)
        }
      }
    })
  }

  requestHotCityList() {
    hotCitys = defaultHotCityArray
  }

  currentCityAction(name) {
    this.selectEndResultCity(name)
  }

  // 点击右侧字母滑动到相应位置
  scrollToList(item, index) {
    let position = 0;
    for (let i = 0; i < index; i++) {
      position += totalHeight[i]
    }
    this.refs.scrollView.scrollTo({
      x: 0,
      y: position,
      animated: true
    });
  }

  /*右侧索引*/
  _renderSideSectionView() {
    const sectionItem = cityDatas.map((item, index) => {
      return (
        <Text onPress={() => this.scrollToList(item, index)} key={index} style={styles.rightSideText}>
          {item.sortLetters}
        </Text>
      )
    });

    return (
      <TouchableHighlight   
        // activeOpacity={0.6}
        underlayColor='red' 
        style={styles.rightSlideAreaTouchableHighlight}
      >
        <View style={styles.rightSlideArea}>
          {sectionItem}
        </View>
      </TouchableHighlight>
    );
  }

  // 渲染城市列表
  _renderCityList() {
    let lists = [];
    for (let i = 0; i < cityDatas.length; i++) {
      let sections = cityDatas[i];
      let header =
        <View key={sections.title} style={styles.cityLetterBox}>
          <Text style={styles.cityLetterText}>{sections.sortLetters}</Text>
        </View>;
      lists.push(header);

      for (let j = 0; j < sections.data.length; j++) {
        let element = sections.data[j];
        let cityCell =
          <TouchableOpacity key={element.name + j} onPress={() => {
            this.selectCity(element)
          }}
          >
            <View style={styles.cityTextBox}>
              <Text style={styles.cityTextStyle}>{element.name}</Text>
            </View>
          </TouchableOpacity>;

        lists.push(cityCell);
      }
    }
    return lists;
  }

  selectCity(cityItem) {
    this.selectEndResultCity(cityItem.name)
  }

  hotCity(name) {
    this.selectEndResultCity(name)
  }

  renderHotCityArray(hotCityArray) {
    let eleArray = [];
    let subArray = hotCityArray.slice(0, 12);
    for (let index = 0; index < subArray.length; index++) {
      const element = subArray[index];
      const ele =
        <TouchableOpacity key={element.cityCode} onPress={() => {this.hotCity(element.cityName)}}>
          <View style={[styles.textView, {marginTop: 10}]}>
            <Text style={{color: "#333333", fontSize: 14,}}>{element.cityName}</Text>
          </View>
        </TouchableOpacity>;
      eleArray.push(ele);
    }
    return eleArray;
  }

    render() {
      return (
        <View style={{flex: 1}}>
          <View style={{backgroundColor: "#FFFFFF"}}>
            <Text style={styles.titleText}>当前定位城市</Text>
            <View style={styles.currentView}>
              <TouchableOpacity onPress={() => {
                this.currentCityAction(this.state.currentCity)
              }}
                style={{width: 100,}}
              >
                <View style={[styles.textView, {marginLeft: 15, width: 100,}]}>
                  <Text style={{color: "#C49225", fontSize: 14,}}>{this.state.currentCity}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.currentCityAction('附近')
              }}
                style={{width: 100,}}
              >
                <View style={[styles.textView, {marginLeft: 5, width: 100,}]}>
                  <Text style={{color: "#C49225", fontSize: 14,}}>附近</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.titleText}>热门城市</Text>
            <View style={styles.hotView}>
              {this.renderHotCityArray(hotCitys)}
            </View>
          </View>

          <ScrollView 
            style={{backgroundColor: '#FFFFFF', height: 400}}
            ref='scrollView'
            scrollY
            scrollWithAnimation
            enableBackToTop
            scrollTop={0}
            lowerThreshold={250}
            enableFlex
            scrollAnchoring
          >
            {this._renderCityList()}
          </ScrollView>
          {this._renderSideSectionView()}
        </View>
      )
    }
}

export default connect(
  ({
    home,
  }) => ({
    home,
  }),
)(cityList);

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "#ECEBED"
    },
    titleText: {
        marginLeft: 30,
        marginTop: 20,
        color: "#999999",
        fontSize: 13,
    },
    currentView: {
        marginTop: 10,
        paddingBottom: 20,
        display: 'flex',
        flexDirection: 'row'
    },
    textView: {
        minWidth: 40,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 10,
    },
    hotView: {
        marginTop: 5,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginLeft: 30,
        marginRight: 25,
        paddingBottom: 20,
        marginBottom: 15,
    },
    rightSlideAreaTouchableHighlight: {
      position: 'absolute',
      // borderWidth: 2,
      // borderColor: 'red',
      top: 0,
      right: 5,
      marginTop: sectionTopBottomHeight,
      marginBottom: sectionTopBottomHeight,
    },
    rightSlideArea: {
      width: sectionWidth,
    },
    rightSideText: {
      textAlign: 'center',
      alignItems: 'center',
      height: sectionItemHeight,
      lineHeight: sectionItemHeight,
      color: '#C49225'
    },
    cityLetterBox: {
      height: ROW_HEIGHT,
      backgroundColor: '#F4F4F4',
      justifyContent: 'center',
    },
    cityLetterText: {
      color: "#999",
      fontSize: 17,
      marginLeft: 20,
    },
    cityTextBox: {
        height: ROW_HEIGHT,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        marginLeft: 20,
    },
    cityTextStyle: {
        color: '#333333',
        fontSize: 14,
    },
});