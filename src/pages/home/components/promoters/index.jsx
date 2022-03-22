import { PureComponent } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Toast, Icon } from "@ant-design/react-native";
import ImagePicker from "react-native-image-crop-picker";

import { FlatList, ActivityIndicator, RefreshControl } from "react-native";
import IndexLists from "./components/IndexLists";
import { recordConditionsQuery, uploadUrl } from "./service";
import dkNoData from "../../../../images/dk_nodata.png";
import dkButton from "../../../../images/dk_button.png";
import "./index.less";

class Promoters extends PureComponent {
  _keyxtractor = (item, index) => item.id;
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      dataArray: [],
      allDataHaveStopLoading: false,
      userId: "",
      isLoading: false,
    };
  }

  componentDidMount() {
    this.getlikeUserLists();
    this.refreshData();
  }

  refreshData() {
    Taro.eventCenter.on("refreshData", (arg) => {
      if (arg?.status) {
        this.setState({ pageNumber: 1 }, () => {
          this.getlikeUserLists();
        });
      }
    });
  }

  getlikeUserLists() {
    const { pageNumber, pageSize } = this.state;
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          this.setState({ userId: res.data });
          recordConditionsQuery({ pageNumber, pageSize, promoterId: res.data })
            .then((data) => {
              if (data.statusCode === 200) {
                console.log(data.data);
                if (data.data.data.records.length === 0) {
                  this.setState({
                    allDataHaveStopLoading: true,
                  });
                }
                this.setState({ dataArray: data.data.data.records });
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
  }

  _renderItem(data) {
    return (
      <View style={{ marginTop: 10 }}>
        <IndexLists data={data} />
      </View>
    );
  }

  loadData(refresh) {
    if (refresh) {
      const { pageNumber, pageSize, userId } = this.state;
      let page = pageNumber + 1;
      let dataArray = [];
      recordConditionsQuery({ pageNumber: page, pageSize, promoterId: userId })
        .then((data) => {
          if (data.statusCode === 200) {
            dataArray = this.state.dataArray.concat(data.data.data.records);
            this.setState({
              dataArray: dataArray,
              pageNumber: page,
            });
            if (data.data.data.records.length < pageSize) {
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
    } else {
      this.setState(
        {
          isLoading: true,
          pageNumber: 1,
        },
        () => {
          const { pageNumber, pageSize, userId } = this.state;
          recordConditionsQuery({ pageNumber, pageSize, promoterId: userId })
            .then((data) => {
              if (data.statusCode === 200) {
                this.setState(
                  { dataArray: data.data.data.records, isLoading: false },
                  () => {
                    this.loadData(true);
                  }
                );
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
          <Icon name="meh" color="black" style={{ fontSize: 36, margin: 10 }} />
          <Text>已全部加载啦～</Text>
        </View>
      );
    }
  }

  photoDkClock() {
    const that = this;
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log("image", image);
      const formData = new FormData();
      let file = {
        uri: image.path,
        type: "multipart/form-data",
        name: "image.jpeg",
      }; //这里的key(uri和type和name)不能改变,
      formData.append("file", file);
      formData.append("tenantId", "4");
      const key = Toast.loading("加载中...");
      fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          console.log("responseData");
          if (responseData.status === 200) {
            Toast.remove(key);
            Taro.navigateTo({
              url: `/pages/home/components/promotersDk/index?photo=${
                responseData.data.domain + responseData.data.path
              }&promoterId=${that.state.userId}&name=${
                that.state.nickName
              }&tel=${that.state.tel}`,
            });
          } else {
            Toast.remove(key);
          }
        })
        .catch((error) => {
          Toast.remove(key);
          Toast.fail({
            content: `遇到了错误${error}`,
            duration: 2,
          });
        });
    });
  }

  render() {
    return (
      <View
        className={
          this.state.dataArray <= 0
            ? "no-data-promoters-page"
            : "promoters-page"
        }
      >
        {this.state.dataArray <= 0 ? (
          <Image src={dkNoData} className="dkNoData" />
        ) : (
          <View className="promoters-page">
            <FlatList
              keyxtractor={this._keyxtractor}
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
                this.loadData(true);
              }}
              onEndReachedThreshold={0.1}
              style={{ marginBottom: 200, height: "100%" }}
            />
          </View>
        )}
        <Image
          src={dkButton}
          className="dkbutton"
          onClick={() => this.photoDkClock()}
        />
      </View>
    );
  }
}

export default Promoters;
