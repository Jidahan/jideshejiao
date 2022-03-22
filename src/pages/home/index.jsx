import { Component } from "react";
import Taro from "@tarojs/taro";
import { connect } from "react-redux";
import { createThumbnail } from "react-native-create-thumbnail";
import {
  ImageBackground,
  TouchableHighlight,
  StyleSheet,
  ActionSheetIOS,
} from "react-native";
import { View, Text, Image, ScrollView, Video } from "@tarojs/components";
import {
  Icon,
  List,
  Button,
  WingBlank,
  Card,
  Toast,
  Flex,
  Modal,
} from "@ant-design/react-native";
import FastImage from "react-native-fast-image";
import ImagePicker from "react-native-image-crop-picker";
import RNFS from "react-native-fs";
import Clipboard from "@react-native-clipboard/clipboard";
import zwWomen from "../../images/zwWomen.png";
import zwMan from "../../images/zwMan.png";
import personInfoImg from "../../images/personInfo.png";
import manImg from "../../images/homeman.png";
import realPersonImg from "../../images/realPerson.png";
import photoImg from "../../images/photo.png";
import historyCallPersonImg from "../../images/historyCallPerson.png";
import invitecodeImg from "../../images/invitecode.png";
import shareImg from "../../images/share.png";
import adviceImg from "../../images/advice.png";
import versonImg from "../../images/verson.png";
import logoutImg from "../../images/logout.png";
import deleteWhite from "../../images/deleteWhite.png";
import dkImg from "../../images/home_dk.png";

import {
  personalCenter,
  uploadUrl,
  fileUpload,
  faceDetect,
  switchAuthenticationStatus,
  delUserData,
  findShareConfig,
} from "./service";
import "./index.less";

Toast.config({
  duration: 0,
});

const Item = List.Item;
class Home extends Component {
  constructor(props) {
    super(props);
    (this.state = {
      imgArray: [],
      logoutVisible: false,
      userInfo: "",
      selectSmallImg: "",
      gender: "",
      isDel: false,
      tipUserGoAuth: false,
      identity: "",
      tel: "",
      username: "",
      loading: false,
      userIdentity: "",
    }),
      (this.copyYqm = this.copyYqm.bind(this));
    this.adviceClick = this.adviceClick.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.logoutSubmit = this.logoutSubmit.bind(this);
    this.shareClick = this.shareClick.bind(this);
    this.personInfoClick = this.personInfoClick.bind(this);
    this.historyVisiti = this.historyVisiti.bind(this);
    this.addPhoto = this.addPhoto.bind(this);
    this.selectSmallImg = this.selectSmallImg.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.goPersonAuthentication = this.goPersonAuthentication.bind(this);
    this.personAuth = this.personAuth.bind(this);
    this.editPassword = this.editPassword.bind(this);
    this.fetchRefresh = this.fetchRefresh.bind(this);
    this.promoters = this.promoters.bind(this);
  }

  componentDidMount() {
    this.getUserMessage();
    Taro.eventCenter.on("refershHome", (arg) => {
      if (arg?.status) {
        this.getUserMessage();
      }
    });
    // Taro.getStorage({
    //   key: "gender",
    //   complete: (res) => {
    //     console.log(res);
    //     if (res.errMsg === "getStorage:ok") {
    //       this.setState({ gender: res.data });
    //     }
    //   },
    // });
    Taro.getStorage({
      key: "userIdentity",
      complete: (res) => {
        console.log(res);
        if (res.errMsg === "getStorage:ok") {
          this.setState({ userIdentity: res.data });
        }
      },
    });
  }

  fetchRefresh() {
    console.log("9999999");
    this.getUserMessage();
  }

  getUserMessage() {
    const key = Toast.loading("加载中...");
    this.setState({ loading: true });
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          personalCenter(res.data)
            .then((data) => {
              if (data.data.status === 200) {
                Toast.remove(key);

                this.setState({
                  userInfo: data.data.data,
                  imgArray: data.data.data.photos,
                  identity: data.data.data.identity,
                  tel: data.data.data.tel,
                  username: data.data.data.username,
                  gender: data.data.data.gender,
                  loading: false,
                });
              } else {
                Toast.remove(key);
                Toast.fail({
                  content: data.data.msg,
                  duration: 2,
                });
                this.setState({ loading: false });
              }
            })
            .catch((error) => {
              Toast.remove(key);
              Toast.fail({
                content: `遇到了错误${error}`,
                duration: 2,
              });
              this.setState({ loading: false });
            });
        }
      },
    });
  }

  personInfoClick() {
    if (this.state.userInfo.personAuthentication !== 1) {
      this.setState({ tipUserGoAuth: true });
    } else {
      Taro.navigateTo({
        url: `/pages/home/components/personInfoPage/index?data=${JSON.stringify(
          this.state.userInfo
        )}&identity=${this.state.identity}`,
      });
    }
  }

  copyYqm() {
    Clipboard.setString(this.state.userInfo.invitationCode);
    Toast.success({
      content: "复制成功",
      duration: 0.5,
      mask: true,
      stackable: false,
    });
  }

  adviceClick() {
    Taro.navigateTo({
      url: "/pages/home/components/advicePage/index",
    });
  }

  logoutClick() {
    this.setState({ logoutVisible: true });
  }

  logoutSubmit() {
    const key = Toast.loading("退出登录...");
    this.props.dispatch({
      type: "userInfo/resetUserData",
    });
    setTimeout(() => {
      Toast.remove(key);
      Toast.success({
        content: "退出成功！",
        duration: 0.2,
      });
      Taro.clearStorage();
      // Taro.eventCenter.off();
      Taro.redirectTo({
        url: "/pages/login/index",
      });
    }, 1);
  }

  shareClick() {
    findShareConfig().then((data) => {
      if (data.statusCode === 200) {
        const reultData = data.data.data;
        ActionSheetIOS.showShareActionSheetWithOptions(
          {
            title: reultData.title,
            message: reultData.content,
            url: `https://share.jd.darling1314.com/#/yq?userId=${this.state.userInfo.id}`,
            subject: "Share Link", // for email
          },
          function (error) {
            console.log("error", error);
          },
          function (e) {
            if (e) {
              Toast.success({
                content: "分享成功",
                duration: 1,
              });
            } else {
              Toast.fail({
                content: "分享失败",
                duration: 1.5,
              });
            }
            console.log("errorerror", e);
          }
        );
      } else {
        Toast.fail({
          content: data.data.data.msg,
          duration: 1.5,
        });
      }
    });
  }

  addPhoto() {
    if (this.state.userInfo.personAuthentication !== 1) {
      this.setState({ tipUserGoAuth: true });
    } else {
      const sourceType =
        this.state.identity == 1 ? ["camera", "album"] : ["camera"];
      if (this.state.userInfo.personAuthentication !== 1) {
        this.setState({ tipUserGoAuth: true });
      } else {
        Taro.chooseImage({
          count: 1,
          sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType, // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
          success: (res) => {
            this.uploadImage(res.tempFilePaths);
          },
        });
      }
    }
  }

  addVideo() {
    const sourceType =
      this.state.identity == 1 ? ["camera", "album"] : ["camera"];
    const that = this;
    Taro.chooseVideo({
      sourceType,
      maxDuration: 60,
      compressed: true,
      camera: "front",
      success: function (res) {
        const { duration } = res; //视频时间毫秒数
        const key = Toast.loading("上传/认证中...");
        Taro.getStorage({
          key: "userId",
          complete: (storage) => {
            if (storage.errMsg === "getStorage:ok") {
              console.log(
                "parseInt(parseInt(duration / 1000) / 2) * 1000",
                parseInt(parseInt(duration / 1000) / 2) * 1000,
                parseInt(duration)
              );
              createThumbnail({
                //截取第1秒照片
                url: res.tempFilePath,
                timeStamp: 1000,
                format: "jpeg",
              })
                .then((response) => {
                  //得到第1秒的照片
                  createThumbnail({
                    //开始截取中间照片
                    url: res.tempFilePath,
                    timeStamp: parseInt(parseInt(duration / 1000) / 2) * 1000,
                    format: "jpeg",
                  })
                    .then((videoCenterImg) => {
                      //得到中间的照片
                      createThumbnail({
                        //截取结尾照片
                        url: res.tempFilePath,
                        timeStamp: parseInt(duration),
                        format: "jpeg",
                      })
                        .then((videoEndImg) => {
                          //得到结尾的照片
                          RNFS.readFile(response.path, "base64").then(
                            (oneImgBase) => {
                              RNFS.readFile(videoCenterImg.path, "base64").then(
                                (twoImgBase) => {
                                  RNFS.readFile(
                                    videoEndImg.path,
                                    "base64"
                                  ).then((threeImgBase) => {
                                    const formData = new FormData();
                                    let file = {
                                      uri: res.tempFilePath,
                                      type: "multipart/form-data",
                                      name: "file.mp4",
                                    }; //这里的key(uri和type和name)不能改变,
                                    formData.append("file", file);
                                    formData.append("tenantId", "4");
                                    fetch(uploadUrl, {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "multipart/form-data",
                                      },
                                      body: formData,
                                    })
                                      .then((upresponsedata) => {
                                        return upresponsedata.json();
                                      })
                                      .then((responseData) => {
                                        if (responseData.status === 200) {
                                          const headImgData = new FormData();
                                          let headFile = {
                                            uri: response.path,
                                            type: "multipart/form-data",
                                            name: "headfile.jpeg",
                                          };
                                          headImgData.append("file", headFile);
                                          fetch(uploadUrl, {
                                            //上传第1秒照片
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "multipart/form-data",
                                            },
                                            body: headImgData,
                                          })
                                            .then((headResponse) => {
                                              return headResponse.json();
                                            })
                                            .then((headResponseData) => {
                                              if (
                                                headResponseData.status === 200
                                              ) {
                                                fileUpload({
                                                  type: 2,
                                                  url: [
                                                    `${
                                                      responseData.data.domain +
                                                      responseData.data.path
                                                    }`,
                                                  ],
                                                  userId: storage.data,
                                                  videoUrl:
                                                    headResponseData.data
                                                      .domain +
                                                    headResponseData.data.path,
                                                  base: twoImgBase,
                                                  baseList: [
                                                    oneImgBase,
                                                    twoImgBase,
                                                    threeImgBase,
                                                  ],
                                                }).then((data) => {
                                                  if (
                                                    data.data.status === 200
                                                  ) {
                                                    Toast.remove(key);
                                                    Toast.success({
                                                      content: "上传成功",
                                                      duration: 1,
                                                    });
                                                    that.getUserMessage();
                                                  } else {
                                                    Toast.remove(key);
                                                    Toast.fail({
                                                      content: data.data.msg,
                                                      duration: 2,
                                                    });
                                                  }
                                                });
                                              }
                                            });
                                        }
                                      })
                                      .catch((error) => {
                                        console.error("error", error);
                                      });
                                    // faceDetect({
                                    //   //进行人脸对比
                                    //   type: 2,
                                    //   userId: storage.data,
                                    //   imgUrl: "",
                                    //   base: twoImgBase,
                                    //   baseList: [
                                    //     oneImgBase,
                                    //     twoImgBase,
                                    //     threeImgBase,
                                    //   ],
                                    // }).then((personTrueFalsedata) => {
                                    //   if (
                                    //     personTrueFalsedata.data.status === 200
                                    //   ) {
                                    //     //人脸对比成功

                                    //   } else {
                                    //     Toast.remove(key);
                                    //     Toast.fail({
                                    //       content: personTrueFalsedata.data.msg,
                                    //       duration: 2,
                                    //     });
                                    //   }
                                    // });
                                  });
                                }
                              );
                            }
                          );
                        })
                        .catch((error) => {
                          Toast.remove(key);
                          Toast.fail({
                            content: `遇到了错误${error}`,
                            duration: 2,
                          });
                        });
                    })
                    .catch((error) => {
                      Toast.remove(key);
                      Toast.fail({
                        content: `遇到了错误${error}`,
                        duration: 2,
                      });
                    });
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
      },
    });
  }

  // 上传图片
  uploadImage(tempFilePaths) {
    const key = Toast.loading("上传/认证中...");
    Taro.getStorage({
      key: "userId",
      complete: (storage) => {
        if (storage.errMsg === "getStorage:ok") {
          ImagePicker.openCropper({
            path: tempFilePaths[0],
            width: 400,
            height: 400,
          })
            .then((image) => {
              const formData = new FormData();
              let file = {
                uri: image.path,
                type: "multipart/form-data",
                name: "image.jpeg",
              }; //这里的key(uri和type和name)不能改变,
              formData.append("file", file);
              formData.append("tenantId", "4");
              RNFS.readFile(image.path, "base64")
                .then((content) => {
                  // content 为base64数据
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
                      console.log("responseData", responseData);
                      if (responseData.status === 200) {
                        fileUpload({
                          type: 1,
                          url: [
                            `${
                              responseData.data.domain + responseData.data.path
                            }`,
                          ],
                          userId: storage.data,
                          base: content,
                        })
                          .then((data) => {
                            if (data.data.status === 200) {
                              Toast.remove(key);
                              Toast.success({
                                content: "上传成功",
                                duration: 1,
                              });
                              this.getUserMessage();
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
                    })
                    .catch((error) => {
                      Toast.remove(key);
                      Toast.fail({
                        content: `遇到了错误${error}`,
                        duration: 2,
                      });
                    });
                })
                .catch((err) => {
                  console.log("reading error: " + err);
                });
            })
            .catch(() => {
              Toast.remove(key);
            });
        }
      },
    });
  }

  photo() {
    if (this.state.userInfo.personAuthentication !== 1) {
      this.setState({ tipUserGoAuth: true });
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["取消", "上传照片", "上传视频"],
          cancelButtonIndex: 0,
          userInterfaceStyle: "dark",
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            return;
          } else if (buttonIndex === 1) {
            this.addPhoto();
          } else if (buttonIndex === 2) {
            this.addVideo();
          }
        }
      );
    }
  }

  historyVisiti() {
    Taro.navigateTo({
      url: `/pages/home/components/historyVisit/index`,
    });
  }

  selectSmallImg(reward) {
    this.setState({ selectSmallImg: reward });
  }

  goPhotosPage = (id) => {
    Taro.navigateTo({
      url: `/pages/photoLists/index?userId=${id}&parent=home`,
    });
  };

  myPhotosClick = (url) => {
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
  };

  myVideoClick = (id) => {
    let videoContext = Taro.createVideoContext(id);
    videoContext.requestFullScreen();
  };

  goPersonAuthentication() {
    Taro.eventCenter.on("authUserIsRefresh", (arg) => {
      if (arg?.status) {
        this.getUserMessage();
      }
    });
    Taro.navigateTo({
      url: `/pages/face/index?userId=${this.state.userInfo.id}&pageType=home`,
    });
  }

  editPassword() {
    Taro.navigateTo({
      url: `/pages/home/components/resetPassword/index?identity=${this.state.identity}&tel=${this.state.tel}&username=${this.state.username}`,
    });
  }

  promoters() {
    Taro.navigateTo({
      url: `/pages/home/components/promoters/index?userId=${this.state.userInfo.id}&nickName=${this.state.userInfo.nickName}&tel=${this.state.userInfo.tel}`,
    });
  }

  personAuth() {
    switchAuthenticationStatus({
      certificationLevel: 2,
      id: this.state.userInfo.id,
    })
      .then((data) => {
        if (data.data.status === 200) {
          Toast.success({
            content: "已提交男神认证",
            duration: 1,
          });
          this.getUserMessage();
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

  onLongPress = () => {
    this.setState({ isDel: !this.state.isDel });
  };

  goSubmitDel = (id) => {
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
              if (data.statusCode === 200) {
                Toast.remove(key);
                Toast.success({
                  content: "删除成功",
                  duration: 1,
                });
                this.getUserMessage();
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
  };

  render() {
    const { imgArray, userInfo, selectSmallImg, isDel, gender } = this.state;
    const imgArrayHeight =
      imgArray.length < 5
        ? 90
        : imgArray.length < 11 && imgArray.length >= 5
        ? 170
        : 220;
    const topHeadBgImg =
      userInfo.photos &&
      userInfo.photos?.filter((reward) => {
        return reward.url.indexOf("mp4") === -1;
      });

    const oldHeadImg = userInfo?.historyProfilePhotos
      ?.filter((fdata) => {
        return Boolean(fdata.profilePhotoUrl) === true;
      })
      .map((reward) => {
        return {
          id: reward.id,
          url: reward.profilePhotoUrl,
        };
      });

    const newTopHeadBgImg = topHeadBgImg &&
      oldHeadImg && [...oldHeadImg, ...topHeadBgImg];

    const topScrollViewImg = newTopHeadBgImg?.slice(0, 3);

    let sourceUrl;
    if (topScrollViewImg && topScrollViewImg.length > 0) {
      sourceUrl = {
        uri:
          selectSmallImg.url ||
          (topScrollViewImg &&
            topScrollViewImg.length > 0 &&
            topScrollViewImg[0].url),
        priority: FastImage.priority.normal,
      };
    } else {
      if (userInfo.photo !== "") {
        sourceUrl = {
          uri: userInfo.photo,
          priority: FastImage.priority.normal,
        };
      } else {
        if (gender === 1) {
          sourceUrl = zwMan;
        } else {
          sourceUrl = zwWomen;
        }
      }
    }
    return (
      <ScrollView
        style={{
          // flex: 1,
          backgroundColor: "#f5f5f9",
          marginBottom: 95,
          height: 1,
        }}
        refresherEnabled
        refresherTriggered={this.state.loading}
        enhanced
        onScrollToUpper={this.fetchRefresh}
        onRefresherPulling={this.fetchRefresh}
        onRefresherRefresh={this.fetchRefresh}
        scrollY
        refresherThreshold={100}
      >
        <View className="container">
          <FastImage
            className="img"
            source={sourceUrl}
            resizeMode={FastImage.resizeMode.cover}
          >
            <View className="rightTopImgAdd" onClick={this.addPhoto}>
              <Icon
                name="plus"
                size="md"
                style={{ color: "white", fontSize: 30 }}
              />
            </View>
            <Text className="imgOnText">{userInfo.nickName}</Text>
            <Text className="imgOnTwoText">
              {userInfo.city} {userInfo.age}岁
            </Text>
            <View className="imgArray">
              <ScrollView scrollX>
                {topScrollViewImg?.map((reward) => {
                  return (
                    <View
                      style={{ width: 50, height: 50, marginLeft: 10 }}
                      className={
                        reward === this.state.selectSmallImg
                          ? "selectImgArrayOneImg"
                          : ""
                      }
                      key={reward.id}
                      onClick={() => this.selectSmallImg(reward)}
                    >
                      <FastImage
                        source={{
                          uri: reward ? `${reward.url}` : null,
                          priority: FastImage.priority.normal,
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 10,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      ></FastImage>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <View className="bottomText">
              <Icon name="alert" size="md" color="#efb336" />
              <Text style={{ color: "white", fontWeight: "bold" }}>
                全身照越多(至少一张正面俩张侧面),才能被评为
                {this.state.gender == 2 ? "女神" : "男神"}！
              </Text>
            </View>
          </FastImage>
        </View>
        <List style={{ marginTop: 10 }}>
          <Item
            arrow="horizontal"
            thumb={<Image src={personInfoImg} className="iconSizeStyle" />}
            onPress={this.personInfoClick}
          >
            个人资料
          </Item>
          <Item
            arrow="horizontal"
            thumb={
              this.state.gender == 2 ? (
                <Image
                  src={manImg}
                  className="iconSizeStyle"
                  style={{ width: 30, height: 30 }}
                />
              ) : (
                <Image
                  src={manImg}
                  className="iconSizeStyle"
                  style={{ width: 30, height: 30 }}
                />
              )
            }
            onPress={userInfo.certificationLevel !== 1 ? null : this.personAuth}
            extra={
              userInfo.certificationLevel == 1
                ? "普通用户"
                : userInfo.certificationLevel == 2
                ? "待审核"
                : userInfo.certificationLevel == 3
                ? "男神"
                : userInfo.certificationLevel == 4
                ? "女神"
                : ""
            }
          >
            {this.state.gender == 2 ? "女神认证" : "男神认证"}
          </Item>
          <Item
            thumb={<Image src={realPersonImg} className="iconSizeStyle" />}
            onPress={
              userInfo.personAuthentication === 1
                ? null
                : this.goPersonAuthentication
            }
            extra={
              userInfo.personAuthentication === 1 ? "已认证" : "点击进行认证"
            }
            arrow="empty"
            disabled={userInfo.personAuthentication === 1}
          >
            真人认证
          </Item>
          <WingBlank size="lg">
            <Card>
              <Card.Header
                title="我的相册"
                thumbStyle={{ width: 30, height: 30 }}
                thumb={<Image src={photoImg} className="iconSizeStyle" />}
                extra={
                  <Item arrow="horizontal" onPress={this.photo.bind(this)}>
                    <Text style={{ marginLeft: 10 }}>上传照片/视频</Text>
                  </Item>
                }
              />
              <Card.Body style={{ height: imgArrayHeight, overflow: "hidden" }}>
                <WingBlank>
                  <Flex direction="row" justify="between" wrap="wrap">
                    {userInfo?.photos?.map((reward) => {
                      if (reward.type === 1) {
                        if (
                          userInfo?.photos.length === 8 &&
                          userInfo?.photos[userInfo?.photos.length - 1].id ===
                            reward.id
                        ) {
                          return (
                            <TouchableHighlight
                              key={reward.id}
                              onPress={() => this.goPhotosPage(userInfo.id)}
                              onLongPress={this.onLongPress}
                              underlayColor="white"
                            >
                              <FastImage
                                source={{
                                  uri: `${reward.url}?width=50&height=0`,
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                style={{
                                  width: 70,
                                  height: 70,
                                  marginLeft: 5,
                                  marginBottom: 10,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 5,
                                }}
                                key={reward.id}
                              >
                                <Text style={{ color: "white", fontSize: 20 }}>
                                  更多
                                </Text>
                              </FastImage>
                            </TouchableHighlight>
                          );
                        } else {
                          return (
                            <TouchableHighlight
                              key={reward.id}
                              onPress={() => this.myPhotosClick(reward.url)}
                              onLongPress={this.onLongPress}
                              underlayColor="white"
                            >
                              <FastImage
                                source={{
                                  uri: reward.url,
                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                style={{
                                  width: 70,
                                  height: 70,
                                  marginLeft: 5,
                                  marginBottom: 10,
                                  borderRadius: 5,
                                }}
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
                                      right: 5,
                                      bottom: 10,
                                      zIndex: 2,
                                    }}
                                    onClick={() => this.goSubmitDel(reward.id)}
                                  >
                                    <Image
                                      src={deleteWhite}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    />
                                  </View>
                                ) : null}
                              </FastImage>
                            </TouchableHighlight>
                          );
                        }
                      } else {
                        return (
                          <TouchableHighlight
                            key={reward.id}
                            onPress={() =>
                              this.myVideoClick(`videocc${reward.id}`)
                            }
                            onLongPress={this.onLongPress}
                            underlayColor="white"
                          >
                            <View>
                              <Video
                                style={{
                                  width: 70,
                                  height: 70,
                                  marginLeft: 5,
                                  borderRadius: 5,
                                  marginBottom: 10,
                                }}
                                src={reward.url}
                                key={reward.id}
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
                                    width: 70,
                                    height: 20,
                                    position: "absolute",
                                    bottom: 9,
                                    zIndex: 2,
                                    textAlign: "center",
                                    color: "white",
                                    backgroundColor: "black",
                                    marginLeft: 5,
                                    borderRadius: 5,
                                  }}
                                >
                                  审核中
                                </View>
                              ) : reward.stateType == 1 ? (
                                <View
                                  style={{
                                    width: 70,
                                    height: 20,
                                    position: "absolute",
                                    bottom: 9,
                                    zIndex: 2,
                                    textAlign: "center",
                                    color: "white",
                                    backgroundColor: "red",
                                    marginLeft: 5,
                                    borderRadius: 5,
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
                                    right: 5,
                                    bottom: 16,
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
                          </TouchableHighlight>
                        );
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
              <Card.Footer content="上传更多照片，才能吸引异性～" />
            </Card>
          </WingBlank>
          <Item
            arrow="horizontal"
            thumb={
              <Image src={historyCallPersonImg} className="iconSizeStyle" />
            }
            onPress={this.historyVisiti}
            extra={`有${userInfo.historicalVisitorsNums}个人看过你`}
          >
            历史访客
          </Item>
          <Item
            thumb={<Image src={invitecodeImg} className="iconSizeStyle" />}
            disabled
            extra={
              <View className="copyExtra" style={{ position: "relative" }}>
                <Text style={{ position: "absolute", bottom: -8, left: 30 }}>
                  {userInfo.invitationCode}
                </Text>
                <Button
                  style={{ position: "absolute", right: 15, bottom: -16 }}
                  type="primary"
                  className="copyButton"
                  onPress={this.copyYqm}
                >
                  复制
                </Button>
              </View>
            }
          >
            邀请码
          </Item>
          <Item
            arrow="horizontal"
            thumb={<Image src={shareImg} className="iconSizeStyle" />}
            onPress={this.shareClick}
          >
            分享给好友
          </Item>
          <Item
            arrow="horizontal"
            thumb={<Image src={adviceImg} className="iconSizeStyle" />}
            onPress={this.adviceClick}
          >
            意见反馈
          </Item>
          <Item
            arrow="horizontal"
            thumb={<Image src={adviceImg} className="iconSizeStyle" />}
            onPress={this.editPassword}
          >
            修改密码
          </Item>
          {this.state.userIdentity == 1 ? (
            <Item
              arrow="horizontal"
              thumb={<Image src={dkImg} className="iconSizeStyle" />}
              onPress={this.promoters}
            >
              推广员
            </Item>
          ) : null}

          <Item
            thumb={<Image src={versonImg} className="iconSizeStyle" />}
            extra={<Text>V1.0.1</Text>}
          >
            当前版本
          </Item>
          <Item
            thumb={<Image src={logoutImg} className="iconSizeStyle" />}
            extra={null}
            onPress={this.logoutClick}
          >
            退出账号
          </Item>
        </List>
        <Modal
          title={null}
          transparent
          onClose={() => {
            this.setState({ logoutVisible: false });
          }}
          maskClosable
          visible={this.state.logoutVisible}
          footer={[
            {
              text: "取消",
              onPress: () => this.setState({ logoutVisible: false }),
            },
            { text: "确认退出", onPress: this.logoutSubmit },
          ]}
        >
          <View style={{ paddingVertical: 20 }}>
            <Text style={{ textAlign: "center" }}>确认退出登录吗？</Text>
          </View>
        </Modal>
        <Modal
          title="进行该操作需进行真人认证，是否进行认证？"
          transparent
          onClose={() => this.setState({ tipUserGoAuth: false })}
          maskClosable
          visible={this.state.tipUserGoAuth}
          closable
          footer={[
            {
              text: "取消认证",
              onPress: () => this.setState({ tipUserGoAuth: false }),
            },
            { text: "立即认证", onPress: this.goPersonAuthentication },
          ]}
        ></Modal>
      </ScrollView>
    );
  }
}

export default connect(({ userInfo }) => ({
  userInfo,
}))(Home);

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: "center",
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
  buttonText: {
    textAlign: "center",
    padding: 20,
    color: "white",
  },
});
