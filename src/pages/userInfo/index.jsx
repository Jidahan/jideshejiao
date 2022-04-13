import { Component } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Text,
  CoverView,
  ScrollView,
  Image,
  Video,
} from "@tarojs/components";
import {
  Icon,
  List,
  WingBlank,
  Card,
  Flex,
  Modal,
  Radio,
  Toast,
} from "@ant-design/react-native";
import { ImageBackground, TouchableHighlight } from "react-native";
import FastImage from "react-native-fast-image";

import { BlurView } from "@react-native-community/blur";
import Clipboard from "@react-native-clipboard/clipboard";
import manImg from "../../images/man.png";
import womenImg from "../../images/women.png";
import selectHeartImg from "../../images/selectHeart.png";
import goodActionImg from "../../images/goodAction.png";
import startImg from "../../images/adSum.png";
import photoImg from "../../images/photo.png";
import heartImg from "../../images/userInfoSelect.png";
import trueWomen from "../../images/trueWomen.png";
import trueMan from "../../images/trueMan.png";
import truePerson from "../../images/truePerson.png";
import lookpagePosition from "../../images/lookpagePosition.png";
import scoreLeftImg from "../../images/scoreFunction.png";
import unlockRightImg from "../../images/unlock.png";
import userInfoNoSelect from "../../images/userInfoNoSelect.png";
import "./index.less";
import { appUserDetail, evaluateUsers, collectionUser } from "./service";

const Item = List.Item;
const RadioItem = Radio.RadioItem;
class Userinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      evaluationModal: false,
      evalValue: 1,
      photoImgsModal: false,
      userId: "",
      userInfo: "",
      lookUnlockPhotosUrlModal: false,
      adminUserId: "",
    };
    this.goBack = this.goBack.bind(this);
    this.goMaPhoto = this.goMaPhoto.bind(this);
    this.spenMoneyLook = this.spenMoneyLook.bind(this);
    this.evaluation = this.evaluation.bind(this);
    this.unlock = this.unlock.bind(this);
    this.goLikeFunction = this.goLikeFunction.bind(this);
    this.handOkEvalSubmit = this.handOkEvalSubmit.bind(this);
    this.handOkPayPhotos = this.handOkPayPhotos.bind(this);
    this.copyWx = this.copyWx.bind(this);
  }

  componentDidMount() {
    this.setState({ userId: this.props.route.params.id });
    this.getUserInfo();
    Taro.getStorage({
      key: "adminUserId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          this.setState({ adminUserId: res.data });
        }
      },
    });
  }

  getUserInfo() {
    const key = Toast.loading("加载中...");
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          appUserDetail({
            userId: res.data,
            otherUserId: this.props.route.params.id,
          })
            .then((data) => {
              if (data.data.status === 200) {
                Toast.remove(key);
                this.setState({ userInfo: data.data.data });
              } else {
                Toast.remove(key);
                Toast.fail({
                  content: data.data.msg,
                  duration: 2,
                });
                Taro.navigateBack({
                  delta: 1,
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

  goBack() {
    Taro.navigateBack({
      delta: 1,
    });
  }

  goMaPhoto() {
    const {
      userInfo: { unlockPhotos, photos, id },
      adminUserId,
    } = this.state;
    if (unlockPhotos === 1 || adminUserId == "336") {
      // 跳转详情
      Taro.navigateTo({
        url: `/pages/photoLists/index?userId=${id}`,
      });
    } else {
      if (!photos) {
        Toast.info({
          content: "该用户暂未上传照片",
          duration: 2,
        });
        return;
      } else {
        this.setState({ photoImgsModal: true });
      }
    }
  }

  handOkPayPhotos() {
    Taro.navigateTo({
      url: `/pages/pay/index?goodsType=1&userId=${this.state.userId}`,
    });
    Taro.eventCenter.on("payPhotoStatus", (arg) => {
      if (arg) {
        this.getUserInfo();
      }
    });
  }

  spenMoneyLook() {
    Taro.navigateTo({
      url: `/pages/pay/index?goodsType=2&userId=${this.state.userId}`,
    });
    Taro.eventCenter.on("payWXStatus", (arg) => {
      if (arg) {
        this.getUserInfo();
      }
    });
  }

  evaluation() {
    console.log("评价");
    this.setState({ evaluationModal: true });
  }

  handOkEvalSubmit() {
    const key = Toast.loading("加载中");
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          evaluateUsers({
            evaluatedUserId: this.state.userId,
            ratingLevel: this.state.evalValue,
            userId: res.data,
          })
            .then((data) => {
              console.log(data);
              if (data.data.status === 200) {
                Toast.remove(key);
                Toast.success({
                  content: "评价成功！",
                  duration: 1,
                });
                this.getUserInfo();
              } else {
                Toast.remove(key);
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

  unlock() {
    console.log("解锁");
    Taro.navigateTo({
      url: `/pages/pay/index?userId=${this.state.userId}`,
    });
    Taro.eventCenter.on("payStatus", (arg) => {
      if (arg) {
        this.getUserInfo();
      }
    });
  }

  goLikeFunction() {
    console.log("关注/不关注");
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          const key = Toast.loading("");
          collectionUser({
            otherUserId: this.state.userId,
            userId: Number(res.data),
          })
            .then((data) => {
              if (data.data.status === 200) {
                Toast.remove(key);
                Toast.success({
                  content: data.data.data,
                  duration: 1,
                });
                this.getUserInfo();
              } else {
                Toast.remove(key);
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
        } else {
          console.log("获取存储数据失败");
        }
      },
    });
  }

  copyWx() {
    const {
      userInfo: { wxAccount },
    } = this.state;
    Clipboard.setString(wxAccount);
    Toast.success({
      content: "已复制",
      duration: 0.5,
      mask: true,
      stackable: false,
    });
  }

  imageClick(url) {
    const {
      userInfo: { unlockPhotos, photos },
      adminUserId,
    } = this.state;
    if (unlockPhotos === 1 || adminUserId == "336") {
      const userInfoPhotos = this.state.userInfo.photos.filter((item) => {
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
    } else {
      if (!photos) {
        Toast.info({
          content: "该用户暂未上传照片/视频",
          duration: 2,
        });
        return;
      } else {
        this.setState({ photoImgsModal: true });
      }
    }
  }

  myVideoClick(id) {
    const {
      userInfo: { unlockPhotos, photos },
    } = this.state;
    if (unlockPhotos === 1) {
      let videoContext = Taro.createVideoContext(id);
      videoContext.requestFullScreen();
    } else {
      if (!photos) {
        Toast.info({
          content: "该用户暂未上传照片/视频",
          duration: 2,
        });
        return;
      } else {
        this.setState({ photoImgsModal: true });
      }
    }
  }

  onLongPressVideo = (id) => {
    let videoContext = Taro.createVideoContext(id);
    videoContext.requestFullScreen();
    videoContext.play();
    if (this.state.userInfo.unlockPhotos === 2) {
      setTimeout(() => {
        videoContext.exitFullScreen();
      }, 2000);
    }
  };

  onLongPress = (data) => {
    this.setState({ lookUnlockPhotosUrl: data.url }, () => {
      this.setState({ lookUnlockPhotosUrlModal: true });
    });
    if (this.state.userInfo.unlockPhotos === 2) {
      setTimeout(() => {
        this.setState({
          lookUnlockPhotosUrlModal: false,
          lookUnlockPhotosUrl: "",
        });
      }, 1000);
    }
  };

  render() {
    const { evaluationModal, photoImgsModal, userInfo, adminUserId } =
      this.state;
    const imgArrayHeight =
      userInfo?.photos?.length <= 4
        ? 110
        : userInfo?.photos?.length > 4
        ? 170
        : 60;
    const headPhoto = userInfo?.photos?.filter((item) => {
      return item.type === 1;
    });

    return (
      <View style={{ position: "relative" }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: "#f5f5f9", marginBottom: 20 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className="container">
            <CoverView className="controls">
              <FastImage
                source={{
                  uri: `${userInfo.photo}`,
                  priority: FastImage.priority.normal,
                }}
                className="img"
                resizeMode={FastImage.resizeMode.cover}
              >
                <View
                  className="img"
                  style={{
                    backgroundColor: "#000000",
                    position: "absolute",
                    opacity: 0.6,
                  }}
                ></View>
                <View className="rightTopImgAdd" onClick={this.goBack}>
                  <Icon name="left" size="md" className="leftIconGoBack" />
                </View>
                <View className="imgArray">
                  <View style={{ width: 100, height: 100, marginLeft: 10 }}>
                    <FastImage
                      source={{
                        uri: `${userInfo.photo}?height=100&width=0`,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                      }}
                      className="selectImgArrayOneImg"
                    ></FastImage>
                  </View>
                  <View
                    style={{
                      marginLeft: 20,
                      height: 100,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                    }}
                  >
                    <View className="row">
                      <Text style={{ color: "#ffffff", fontSize: 22 }}>
                        {userInfo.nickName}
                      </Text>
                      <View className="row cardRightTop">
                        <Text style={{ color: "#ffffff", marginRight: 5 }}>
                          {userInfo.onlineState === 1 ? "在线" : "离线"}
                        </Text>
                        <View
                          className={`onlineOrNoOnlineStyle ${
                            userInfo.onlineState === 1 ? "online" : "noOnline"
                          }`}
                        ></View>
                      </View>
                    </View>

                    {adminUserId == "336" ? null : (
                      <View className="row">
                        <Text style={{ color: "#ffffff" }}>
                          {userInfo.age}岁
                        </Text>
                        <View
                          style={{
                            width: 2,
                            height: 2,
                            backgroundColor: "white",
                            borderRadius: 2,
                          }}
                          className="point"
                        ></View>
                        <Text style={{ color: "#ffffff", marginRight: 5 }}>
                          {userInfo.constellation}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {adminUserId == "336" ? null : (
                  <View
                    className="row bottomText"
                    style={{ justifyContent: "space-around" }}
                  >
                    <View className="row">
                      {userInfo.personAuthentication === 1 ? (
                        <Image
                          src={truePerson}
                          style={{ width: 100, height: 31 }}
                        />
                      ) : null}
                      {userInfo.gender === 2 ? (
                        <Image
                          src={trueWomen}
                          style={{ width: 100, height: 31, marginLeft: 10 }}
                        />
                      ) : (
                        <Image
                          src={trueMan}
                          style={{ width: 100, height: 31, marginLeft: 10 }}
                        />
                      )}
                    </View>
                    <View className="row">
                      <Text style={{ color: "#ffffff", marginRight: 10 }}>
                        {userInfo.city}
                      </Text>
                      <Image
                        src={lookpagePosition}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text style={{ color: "#ffffff" }}>
                        {userInfo.distance}
                      </Text>
                    </View>
                  </View>
                )}
              </FastImage>
            </CoverView>
          </View>
          <List>
            <Item
              arrow=""
              thumb={null}
              extra={
                userInfo.collectionIs === 1 ? (
                  <View className="copyExtra" style={{ position: "relative" }}>
                    <Image
                      src={userInfoNoSelect}
                      style={{
                        width: 80,
                        height: 30,
                        position: "absolute",
                        right: 10,
                        top: -15,
                      }}
                      onClick={this.goLikeFunction}
                    />
                  </View>
                ) : (
                  <View className="copyExtra" style={{ position: "relative" }}>
                    <Image
                      src={heartImg}
                      style={{
                        width: 80,
                        height: 30,
                        position: "absolute",
                        right: 10,
                        top: -15,
                      }}
                      onClick={this.goLikeFunction}
                    />
                  </View>
                )
              }
            >
              {adminUserId === "336" ? null : (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Image
                    src={goodActionImg}
                    style={{ width: 28, height: 28 }}
                  />
                  <Text style={{ marginLeft: 5, fontSize: 16 }}>
                    好评: {userInfo.praiseNum}
                  </Text>
                  <Image
                    src={startImg}
                    style={{ width: 28, height: 28, marginLeft: 10 }}
                  />
                  <Text style={{ marginLeft: 5, fontSize: 16 }}>
                    爱豆: {userInfo.individualValues}
                  </Text>
                </View>
              )}
            </Item>
            <View className="inlineView"></View>
            <Card>
              <Card.Header
                title="Ta的相册"
                thumb={null}
                style={{ borderColor: "white" }}
                extra={
                  <Item arrow="horizontal" onPress={this.goMaPhoto}>
                    <Text style={{ fontSize: 18, marginLeft: 80 }}>更多</Text>
                  </Item>
                }
              />
              <Card.Body style={{ height: imgArrayHeight, overflow: "hidden" }}>
                <WingBlank className="photosAll">
                  <Flex wrap="wrap" align="center" justify="between">
                    {userInfo?.photos?.map((reward) => {
                      if (reward.type === 1) {
                        return (
                          <TouchableHighlight
                            key={reward.id}
                            onPress={() => this.imageClick(reward.url)}
                            onLongPress={() =>
                              userInfo.unlockPhotos === 1
                                ? null
                                : this.onLongPress(reward)
                            }
                            underlayColor="white"
                          >
                            <View>
                              <FastImage
                                style={{
                                  width: 70,
                                  height: 70,
                                  marginLeft: 10,
                                  marginBottom: 10,
                                  borderRadius: 5,
                                }}
                                source={{
                                  uri: `${reward.url}?width=70&height=0`,
                                  priority: FastImage.priority.normal,
                                }}
                                className="filterImg"
                                resizeMode={FastImage.resizeMode.cover}
                                // blurRadius={userInfo.unlockPhotos === 2 ? 10 : 0}
                              ></FastImage>
                              {userInfo.unlockPhotos === 2 &&
                              this.state.adminUserId !== "336" ? (
                                <BlurView
                                  className="absoluteBlurView"
                                  blurType="light"
                                  blurAmount={8}
                                  reducedTransparencyFallbackColor="white"
                                />
                              ) : null}
                            </View>
                          </TouchableHighlight>
                        );
                      } else {
                        if (userInfo.unlockPhotos === 1) {
                          return (
                            <TouchableHighlight
                              key={reward.id}
                              onPress={() =>
                                this.myVideoClick(`videocc${reward.id}`)
                              }
                              onLongPress={() =>
                                userInfo.unlockPhotos === 1
                                  ? null
                                  : this.onLongPressVideo(`videocc${reward.id}`)
                              }
                              underlayColor="white"
                            >
                              <Video
                                style={{
                                  width: 70,
                                  height: 70,
                                  marginLeft: 10,
                                  borderRadius: 5,
                                  marginBottom: 10,
                                }}
                                src={reward.url}
                                autoplay={false}
                                loop={false}
                                showCenterPlayBtn={false}
                                controls={false}
                                poster={reward.videoUrl}
                                id={`videocc${reward.id}`}
                              />
                            </TouchableHighlight>
                          );
                        } else {
                          return null;
                        }
                      }
                    })}
                    {userInfo?.photos?.length % 2 === 0 ? (
                      <>
                        <View
                          style={{
                            width: 70,
                            height: 70,
                            marginLeft: 5,
                            marginBottom: 10,
                          }}
                        ></View>
                        <View
                          style={{
                            width: 70,
                            height: 70,
                            marginLeft: 5,
                            marginBottom: 10,
                          }}
                        ></View>
                      </>
                    ) : (
                      <>
                        <View
                          style={{
                            width: 70,
                            height: 70,
                            marginLeft: 5,
                            marginBottom: 10,
                          }}
                        ></View>
                        <View
                          style={{
                            width: 70,
                            height: 70,
                            marginLeft: 5,
                            marginBottom: 10,
                          }}
                        ></View>
                      </>
                    )}
                  </Flex>
                </WingBlank>
              </Card.Body>
            </Card>
            <View className="inlineView"></View>
            <WingBlank size="lg">
              {adminUserId == "336" ? null : (
                <Item
                  thumb={null}
                  disabled
                  extra={`${userInfo.height}cm`}
                  arrow="empty"
                >
                  身高
                </Item>
              )}
              {adminUserId == "336" ? null : (
                <Item
                  thumb={null}
                  disabled
                  extra={`${userInfo.weight}kg`}
                  arrow="empty"
                >
                  体重
                </Item>
              )}

              <Item thumb={null} extra={userInfo.city} arrow="empty" disabled>
                常驻城市
              </Item>
              <Item
                thumb={null}
                extra={
                  userInfo.unlockWeChat === 2 &&
                  this.state.adminUserId !== "336" ? (
                    <Text
                      style={{ color: "#592DFF" }}
                      onClick={this.spenMoneyLook}
                    >
                      解锁查看
                    </Text>
                  ) : (
                    <Text style={{ color: "#592DFF" }} onClick={this.copyWx}>
                      {userInfo.wxAccount}
                    </Text>
                  )
                }
                arrow="empty"
              >
                微信
              </Item>
            </WingBlank>
          </List>
        </ScrollView>

        <View className="bottomButton">
          <ImageBackground
            source={scoreLeftImg}
            style={{ height: 50 }}
            className="cc"
          >
            <View
              onClick={userInfo.evaluated === 1 ? null : this.evaluation}
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#F6386F" }}>
                {userInfo.evaluated === 1 ? "已评价" : "评价"}
              </Text>
            </View>
          </ImageBackground>
          {this.state.adminUserId == "336" ? (
            <ImageBackground
              source={unlockRightImg}
              className="cc"
              style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "-10%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 18, color: "#FFFFFF" }}>已认证</Text>
              </View>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={unlockRightImg}
              className="cc"
              style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "-10%",
              }}
            >
              <View
                onClick={
                  userInfo.unlockPhotos === 1 ? null : this.handOkPayPhotos
                }
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 18, color: "#FFFFFF" }}>
                  {userInfo.unlockPhotos === 1 ? "已解锁" : "解锁"}
                </Text>
              </View>
            </ImageBackground>
          )}
        </View>

        <Modal
          title="评价"
          transparent
          onClose={() => {
            this.setState({ evaluationModal: false });
          }}
          maskClosable
          visible={evaluationModal}
          closable
          footer={[
            { text: "取消", onPress: () => console.log("cancel") },
            { text: "确定", onPress: this.handOkEvalSubmit },
          ]}
        >
          <View style={{ paddingVertical: 20 }}>
            <RadioItem
              checked={this.state.evalValue === 1}
              onChange={(event) => {
                if (event.target.checked) {
                  this.setState({ evalValue: 1 });
                }
              }}
            >
              好评
            </RadioItem>
            <RadioItem
              checked={this.state.evalValue === 2}
              onChange={(event) => {
                if (event.target.checked) {
                  this.setState({ evalValue: 2 });
                }
              }}
            >
              一般
            </RadioItem>
            <RadioItem
              checked={this.state.evalValue === 3}
              onChange={(event) => {
                if (event.target.checked) {
                  this.setState({ evalValue: 3 });
                }
              }}
            >
              差评
            </RadioItem>
          </View>
        </Modal>

        <Modal
          title="付费相册"
          transparent
          onClose={() => {
            this.setState({ photoImgsModal: false });
          }}
          maskClosable
          visible={photoImgsModal}
          closable
          footer={[
            {
              text: "暂不解锁",
              onPress: () => console.log("cancel"),
              style: { color: "#A9A9A9" },
            },
            {
              text: "立即解锁",
              onPress: this.handOkPayPhotos,
              style: { color: "#F6386F" },
            },
          ]}
        >
          <View
            style={{
              paddingVertical: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ marginTop: 20, marginBottom: 0 }}>
              该相册为付费相册，共有
              <Text style={{ color: "#F6386F" }}>
                {userInfo?.photos?.length}
              </Text>
              张照片/视频解锁后可查看
            </Text>
          </View>
        </Modal>

        <Modal
          title={null}
          transparent
          // onClose={() => {
          //   this.setState({ lookUnlockPhotosUrlModal: false });
          // }}
          // maskClosable
          visible={this.state.lookUnlockPhotosUrlModal}
          // closable
          footer={null}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <FastImage
            source={{
              uri: `${this.state.lookUnlockPhotosUrl}?width=300&height=0`,
              priority: FastImage.priority.normal,
            }}
            style={{ width: 300, height: 300 }}
            resizeMode={FastImage.resizeMode.cover}
          ></FastImage>
        </Modal>
      </View>
    );
  }
}

export default Userinfo;
// 下面用来connect数据层
// export default connect(
//   ({
//     userInfo,
//   }) => ({
//     userInfo,
//   }),
// )(Userinfo);
