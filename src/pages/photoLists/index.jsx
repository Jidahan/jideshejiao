import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Image, ScrollView, Video, Text } from "@tarojs/components";
import { Flex, Toast, WhiteSpace, WingBlank } from "@ant-design/react-native";
import FastImage from "react-native-fast-image";

import { ImageBackground } from "react-native";
import gobackImg from "../../images/goback.png";
import deleteImg from "../../images/delete.png";
import deleteWhite from "../../images/deleteWhite.png";
import { getUserPhotos, delUserData } from "./service";
import "./index.less";

class Photolists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardList: [],
      isDel: false,
      isShowDel: true,
    };
    this.goBack = this.goBack.bind(this);
    this.goDel = this.goDel.bind(this);
    this.goNoDel = this.goNoDel.bind(this);
  }

  componentDidMount() {
    const {
      route: {
        params: { userId, parent },
      },
    } = this.props;
    if (parent === "home") {
      this.setState({ isShowDel: true });
    } else {
      this.setState({ isShowDel: false });
    }
    getUserPhotos({
      pageNumber: 1,
      pageSize: 500,
      userId,
      isOneself: parent === "home" ? 1 : 0,
    })
      .then((data) => {
        if (data.statusCode === 200) {
          this.setState({ cardList: data.data.data.records });
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

  myPhotosClick(url) {
    const userInfoPhotos = this.state.cardList.filter((item) => {
      return item.type === 1;
    });
    const i1 = userInfoPhotos.findIndex((value) => value.url === url);
    let imgAry = userInfoPhotos.map((reward) => {
      return reward.url;
    });
    Taro.previewImage({
      urls: imgAry,
      current: imgAry[i1],
    });
  }

  myVideoClick(id) {
    let videoContext = Taro.createVideoContext(id);
    videoContext.requestFullScreen();
  }

  goBack() {
    Taro.navigateBack({
      delta: 1,
    });
  }

  goDel() {
    console.log("123");
    this.setState({ isDel: true });
  }

  goNoDel() {
    this.setState({ isDel: false });
  }

  goSubmitDel(id) {
    const key = Toast.loading("删除中...");
    Taro.getStorage({
      key: "userId",
      complete: (storage) => {
        if (storage.errMsg === "getStorage:ok") {
          delUserData({
            meansId: id,
            userId: storage.data,
          })
            .then((data) => {
              console.log(data);
              if (data.statusCode === 200) {
                Toast.remove(key);
                Toast.success({
                  content: "删除成功",
                  duration: 1,
                });
                const cardList = [...this.state.cardList];
                const newData = cardList.filter((item) => {
                  return item.id !== id;
                });
                this.setState({ cardList: newData });
              } else {
                Toast.fail({
                  content: data.data.msg,
                  duration: 2,
                });
              }
            })
            .catch((error) => {
              Toast.remove(key);
              Toast.fail({
                content: `遇到了错误${error}`,
                duration: 2,
              });
            });
        }
      },
    });
  }

  render() {
    const { cardList, isDel, isShowDel } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 75,
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 35,
          }}
        >
          <View onClick={this.goBack}>
            <Image
              src={gobackImg}
              style={{ width: 20, height: 20, marginLeft: 20 }}
            />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>相册</Text>
          {isShowDel ? (
            !isDel ? (
              <View onClick={this.goDel}>
                <Image
                  src={deleteImg}
                  style={{ width: 20, height: 20, marginRight: 20 }}
                />
              </View>
            ) : (
              <Text
                style={{ marginRight: 11, fontSize: 14 }}
                onClick={this.goNoDel}
              >
                取消
              </Text>
            )
          ) : (
            <View style={{ width: 20, height: 20, marginRight: 20 }}></View>
          )}
        </View>
        <ScrollView className="photoLists-page">
          <WhiteSpace size="sm" />
          <WingBlank style={{ marginBottom: 5 }}>
            <Flex direction="row" justify="between" wrap="wrap">
              {cardList.map((reward) => {
                if (reward.type === 1) {
                  return (
                    <View
                      style={{ width: 100, height: 100, marginBottom: 10 }}
                      key={reward.id}
                      onClick={() => this.myPhotosClick(reward.url)}
                    >
                      <FastImage
                        source={{
                          uri: reward.url,
                          priority: FastImage.priority.normal,
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          zIndex: 1,
                          borderRadius: 10,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      >
                        {reward.stateType == 0 ? (
                          <View
                            style={{
                              width: "100%",
                              height: 20,
                              position: "absolute",
                              bottom: 0,
                              zIndex: 2,
                              textAlign: "center",
                              color: "white",
                              backgroundColor: "black",
                            }}
                          >
                            审核中
                          </View>
                        ) : reward.stateType == 1 ? (
                          <View
                            style={{
                              width: "100%",
                              height: 20,
                              position: "absolute",
                              bottom: 0,
                              zIndex: 2,
                              textAlign: "center",
                              color: "white",
                              backgroundColor: "red",
                            }}
                          >
                            审核不通过
                          </View>
                        ) : null}
                        {isDel ? (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              position: "absolute",
                              right: 10,
                              bottom: 10,
                              zIndex: 2,
                            }}
                            onClick={() => this.goSubmitDel(reward.id)}
                          >
                            <Image
                              src={deleteWhite}
                              style={{ width: "100%", height: "100%" }}
                            />
                          </View>
                        ) : null}
                      </FastImage>
                    </View>
                  );
                } else {
                  return (
                    <View
                      style={{ width: 100, height: 100, marginBottom: 10 }}
                      key={reward.id}
                      onClick={() => this.myVideoClick(`videocc${reward.id}`)}
                    >
                      <Video
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 10,
                        }}
                        src={reward.url}
                        autoplay={false}
                        loop={false}
                        poster={reward.videoUrl}
                        showCenterPlayBtn={false}
                        id={`videocc${reward.id}`}
                        controls={false}
                      />
                      {reward.stateType == 0 ? (
                        <View
                          style={{
                            width: 100,
                            height: 20,
                            position: "absolute",
                            bottom: 0,
                            zIndex: 2,
                            textAlign: "center",
                            color: "white",
                            backgroundColor: "black",
                            borderRadius: 10,
                          }}
                        >
                          审核中
                        </View>
                      ) : reward.stateType == 1 ? (
                        <View
                          style={{
                            width: 100,
                            height: 20,
                            position: "absolute",
                            bottom: 0,
                            zIndex: 2,
                            textAlign: "center",
                            color: "white",
                            backgroundColor: "red",
                            borderRadius: 10,
                          }}
                        >
                          审核不通过
                        </View>
                      ) : null}
                      {isDel ? (
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            position: "absolute",
                            right: 10,
                            bottom: 10,
                            zIndex: 2,
                          }}
                          onClick={() => this.goSubmitDel(reward.id)}
                        >
                          <Image
                            src={deleteWhite}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </View>
                      ) : null}
                    </View>
                  );
                }
              })}
              {cardList.length % 2 === 0 ? (
                <View
                  style={{ width: 100, height: 100, marginBottom: 10 }}
                ></View>
              ) : (
                <View
                  style={{ width: 100, height: 100, marginBottom: 10 }}
                ></View>
              )}
            </Flex>
          </WingBlank>
        </ScrollView>
      </View>
    );
  }
}

export default Photolists;
// 下面用来connect数据层
// export default connect(
//   ({
//     photoLists,
//   }) => ({
//     photoLists,
//   }),
// )(Photolists);
