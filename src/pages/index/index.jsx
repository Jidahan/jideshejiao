import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Icon, SearchBar, Toast, Modal } from "@ant-design/react-native";
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Linking,
} from "react-native";
import IndexLists from "./components/IndexLists";
import { appVersion, appNumberVersion } from "../../utils/version";
import { appUserList, versionApi } from "./service";
import PositionImg from "../../images/position.png";
import AdLists from "./components/AdLists";
import Matching from "./testfilght/testfilght";
import "./index.less";

class Index extends Component {
  _keyxtractor = (item, index) => item.id;

  constructor(props) {
    super(props);
    (this.state = {
      searchValue: "",
      pageNumber: 1,
      pageSize: 10,
      city: "西安",
      dataArray: [],
      isLoading: false,
      latitude: "34.343147",
      longitude: "108.939621",
      range: 10,
      allDataHaveStopLoading: false,
      nowSearch: false,
      haveNewVersionContent: "",
      tipsVersionModal: false,
      isOneBeginApp: true,
      adminUserId: "",
    }),
      (this.searchOnChange = this.searchOnChange.bind(this));
    this.searchOnCancelChange = this.searchOnCancelChange.bind(this);
    this.goCitySelect = this.goCitySelect.bind(this);
    this.goVersionTestFilght = this.goVersionTestFilght.bind(this);
  }

  onTabItemTap() {
    this.setState({ pageNumber: 1 }, () => {
      this.refreshData();
      this.getUserLists();
    });
  }

  componentDidMount() {
    // this.getUserLists();
    // this.refreshData();
    // this.updateCity();
    const that = this;
    Taro.getLocation({
      type: "wgs84",
      success: function (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.setState({
          latitude,
          longitude,
        });
        Taro.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=XKYBZ-36R6D-DP74D-PFWPH-PICQ5-RHFJS`,
          header: {
            "Content-Type": "application/json",
          },
          method: "GET",
          complete: (resCity) => {
            console.log(resCity);
            if (resCity.statusCode === 200) {
              if (!resCity.data.result.address_component.city) {
                that.setState({
                  isLoading: false,
                  allDataHaveStopLoading: true,
                });
                Toast.info({
                  content: `当前定位城市为${resCity.data.result.address_component.nation}，默认查取西安用户数据！`,
                  duration: 2,
                });
                that.setState(
                  {
                    city: "西安",
                    latitude: "34.343147",
                    longitude: "108.939621",
                  },
                  () => {
                    that.refreshData();
                    that.getUserLists();
                    that.updateCity();
                  }
                );
              } else {
                // const city =
                //   resCity.data.result.address_component.city.split("市")[0];
                that.setState(
                  {
                    city: "附近",
                  },
                  () => {
                    that.refreshData();
                    that.getUserLists();
                    that.updateCity();
                  }
                );
              }
            } else {
              that.setState({
                isLoading: false,
                allDataHaveStopLoading: true,
              });
              Toast.fail({
                content:
                  "定位失败，系统将默认查取西安用户数据。如需定位，请检查是否开启该APP定位权限！",
                duration: 2,
              });
              that.setState(
                {
                  city: "西安",
                  latitude: "34.343147",
                  longitude: "108.939621",
                },
                () => {
                  that.refreshData();
                  that.getUserLists();
                  that.updateCity();
                }
              );
              Taro.getStorage({
                key: "userId",
                complete: (useridRes) => {
                  console.log("当前用户数据", useridRes);
                  if (useridRes.errMsg !== "getStorage:ok") {
                    Taro.redirectTo({
                      url: `pages/login/index`,
                    });
                  }
                },
                error: () => {
                  Taro.redirectTo({
                    url: `pages/login/index`,
                  });
                },
              });
            }
          },
        });
      },

      error: function (error) {
        console.log(error);
      },
    });
    Taro.getStorage({
      key: "adminUserId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          this.setState({ adminUserId: res.data });
        }
      },
    });
  }

  goVersionTestFilght() {
    this.setState({ tipsVersionModal: false });
    let url = "https://testflight.apple.com/join/UCRgIvYz";
    Linking.openURL(url);
  }

  componentDidShow() {
    this.refreshData();
  }

  componentDidCatch(error, info) {
    console.log("componentDidCatch", error, info);
  }

  updateCity() {
    Taro.eventCenter.on("updateCity", (arg) => {
      if (arg?.status) {
        this.setState(
          { city: arg?.city === "附近" ? "" : arg?.city, pageNumber: 1 },
          () => {
            this.refreshData();
            this.getUserLists();
          }
        );
      }
    });
  }

  refreshData() {
    Taro.eventCenter.on("goLikeUserIsRefresh", (arg) => {
      if (arg?.status) {
        const resultData = this.state.dataArray.map((reward) => {
          if (reward.userId === arg.id) {
            reward.collectionIs = arg.nowDisabledUser === 1 ? 2 : 1;
          }
          return reward;
        });
        this.setState((prevState) => {
          delete prevState.dataArray;
          return prevState;
        });
        this.setState({ dataArray: resultData });
      }
    });
  }

  getUserLists() {
    const {
      city,
      pageNumber,
      pageSize,
      latitude,
      longitude,
      range,
      searchValue,
    } = this.state;
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          appUserList({
            city: city == "附近" ? "" : city,
            pageNumber,
            pageSize,
            latitude,
            longitude,
            range,
            userId: res.data,
            userName: searchValue,
          })
            .then((data) => {
              if (this.state.isOneBeginApp) {
                versionApi().then((versionData) => {
                  if (versionData.data.status == 200) {
                    const newVersion =
                      versionData.data.data.records[0]?.versionNumber;
                    console.log("newVersion", newVersion);
                    if (Number(appNumberVersion) < Number(newVersion)) {
                      this.setState({
                        haveNewVersionContent:
                          versionData.data.data.records[0]?.updateContent,
                        tipsVersionModal: true,
                        isOneBeginApp: false,
                      });
                    }
                  } else {
                    Toast.fail({
                      content: versionData.data.msg,
                      duration: 1,
                    });
                  }
                });
              }

              if (data.data.status === 200) {
                this.setState({ dataArray: data.data.data });
              } else {
                if (data.data.msg == "参数错误") {
                  Toast.fail({
                    content: data.data.msg,
                    duration: 2,
                  });
                  Taro.clearStorage();
                  Taro.redirectTo({
                    url: "/pages/login/index",
                  });
                } else {
                  Toast.fail({
                    content: data.data.msg,
                    duration: 2,
                  });
                }
              }
            })
            .catch((error) => {
              Toast.fail({
                content: `遇到了错误${error}`,
                duration: 2,
              });
            });
        } else {
          Taro.redirectTo({
            url: `pages/login/index`,
          });
        }
      },
      error: () => {
        Taro.redirectTo({
          url: `pages/login/index`,
        });
      },
    });
  }

  goCitySelect() {
    Taro.navigateTo({
      url: `/pages/citySelect/index`,
    });
  }

  searchOnChange(val) {
    if (!val) {
      this.setState(
        { searchValue: val, pageNumber: 1, nowSearch: false },
        () => {
          this.refreshData();
          this.getUserLists();
        }
      );
    } else {
      this.setState(
        { searchValue: val, pageNumber: 1, nowSearch: true },
        () => {
          this.refreshData();
          this.getUserLists();
        }
      );
    }
  }

  searchOnCancelChange() {
    Taro.hideKeyboard();
    this.setState({ searchValue: "", pageNumber: 1, nowSearch: false }, () => {
      this.refreshData();
      this.getUserLists();
    });
  }

  _renderItem(data) {
    return <IndexLists data={data} />;
  }

  loadData(refresh) {
    if (refresh) {
      const {
        city,
        pageNumber,
        pageSize,
        latitude,
        longitude,
        range,
        searchValue,
      } = this.state;
      let page = pageNumber + 1;
      let dataArray = [];
      Taro.getStorage({
        key: "userId",
        complete: (res) => {
          if (res.errMsg === "getStorage:ok") {
            appUserList({
              city,
              pageNumber: page,
              pageSize,
              latitude,
              longitude,
              range,
              userId: res.data,
              userName: searchValue,
            })
              .then((data) => {
                if (data.statusCode === 200) {
                  dataArray = this.state.dataArray.concat(data.data.data);
                  this.setState({
                    dataArray: dataArray,
                    pageNumber: page,
                  });
                  if (data.data.data.length < pageSize) {
                    this.setState({
                      allDataHaveStopLoading: true,
                    });
                    return;
                  }
                } else {
                  Toast.fail({
                    content: data.data.msg,
                    duration: 2,
                  });
                }
              })
              .catch((error) => {
                Toast.fail({
                  content: `遇到了错误${error}`,
                  duration: 2,
                });
              });
          }
        },
      });
    } else {
      this.setState(
        {
          isLoading: true,
          pageNumber: 1,
        },
        () => {
          const {
            city,
            pageNumber,
            pageSize,
            latitude,
            longitude,
            range,
            searchValue,
          } = this.state;
          Taro.getStorage({
            key: "userId",
            complete: (res) => {
              if (res.errMsg === "getStorage:ok") {
                appUserList({
                  city,
                  pageNumber,
                  pageSize,
                  latitude,
                  longitude,
                  range,
                  userId: res.data,
                  userName: searchValue,
                })
                  .then((data) => {
                    if (data.statusCode === 200) {
                      this.setState({
                        dataArray: data.data.data,
                        isLoading: false,
                      });
                    } else {
                      this.setState({ isLoading: false });
                      Toast.fail({
                        content: data.data.msg,
                        duration: 2,
                      });
                    }
                  })
                  .catch((error) => {
                    this.setState({ isLoading: false });
                    Toast.fail({
                      content: `遇到了错误${error}`,
                      duration: 2,
                    });
                  });
              }
            },
          });
        }
      );
    }
  }

  genIndicator() {
    if (!this.state.allDataHaveStopLoading) {
      return (
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator
            style={{ color: "red", margin: 10 }}
            size="large"
            animating
          />
          <Text>正在加载更多</Text>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: "center" }}>
          <Icon name="meh" color="black" style={{ fontSize: 28, margin: 10 }} />
          <Text>已全部加载啦～</Text>
        </View>
      );
    }
  }

  componentDidHide() {
    Taro.eventCenter.off("goLikeUserIsRefresh");
  }

  render() {
    console.log("this.stata.dataArray", this.state.dataArray);

    const listView = (
      <View className="bodyOut">
        <Modal
          title={`检测到新版本，更新内容为「${this.state.haveNewVersionContent}」，是否立即更新？`}
          transparent
          onClose={() => this.setState({ tipsVersionModal: false })}
          maskClosable
          visible={this.state.tipsVersionModal}
          // closable
          footer={[
            {
              text: "取消",
              onPress: () => this.setState({ tipsVersionModal: false }),
            },
            { text: "立即更新", onPress: this.goVersionTestFilght },
          ]}
        ></Modal>
        <View className="topSearch" style={{ height: "13%" }}>
          <View style={{ width: "70%", position: "relative" }}>
            <SearchBar
              placeholder="输入昵称搜索"
              style={{
                position: "absolute",
                top: -18,
                bottom: 0,
                left: -10,
                height: "80%",
                width: "110%",
                borderRadius: 20,
                backgroundColor: "#E8E8E8",
              }}
              onSubmit={this.searchOnChange}
              onCancel={this.searchOnCancelChange}
              // value={this.state.searchValue}
              styles={{
                wrapper: { backgroundColor: "white" },
              }}
              returnKeyType="search"
            />
          </View>
          <View onClick={this.goCitySelect} style={styles.position}>
            <Image style={{ width: 20, height: 20 }} src={PositionImg} />
            <Text className="searchRightButtonText">
              {this.state.city || "附近"}
            </Text>
          </View>
        </View>
        <View style={{ padding: 20, paddingTop: 0, paddingBottom: 0 }}>
          <AdLists />
        </View>
        <View style={{ marginBottom: 50, height: "63%" }}>
          <FlatList
            keyExtractor={this._keyxtractor}
            data={this.state.dataArray}
            renderItem={(data) => this._renderItem(data)}
            // 下拉刷新
            refreshControl={
              <RefreshControl
                title="加载中..."
                colors={["red"]}
                refreshing={this.state.isLoading}
                onRefresh={() => this.loadData()}
                tintColor="orange"
              />
            }
            ListFooterComponent={() => this.genIndicator()}
            onEndReached={() => {
              this.state.nowSearch ? null : this.loadData(true);
            }}
            style={{ height: "100%" }}
            onEndReachedThreshold={0.1}
          />
        </View>
      </View>
    );

    const testfilghtView = <Matching />;
    console.log("this.state.adminUserId ", this.state.adminUserId);
    return this.state.adminUserId == "336" ? testfilghtView : listView;
  }
}

export default Index;

const styles = StyleSheet.create({
  position: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
});
