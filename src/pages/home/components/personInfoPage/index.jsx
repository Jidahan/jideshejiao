import { Component } from "react";
import Taro from "@tarojs/taro";
import { connect } from "react-redux";
import RNFS from "react-native-fs";
import { View, Text, Image } from "@tarojs/components";
import ImagePicker from "react-native-image-crop-picker";

import { List, DatePicker, Toast } from "@ant-design/react-native";
import { ImageBackground, TextInput } from "react-native";
import headImg from "../../../../images/zwWomen.png";
import headImgMan from "../../../../images/zwMan.png";
import editPersonImg from "../../../../images/editPersonImg.png";
import editUserInfoButtonImg from "../../../../images/editUserInfo.png";
import "./index.less";
import { userSetting, uploadUrl, faceDetect, personalCenter } from "./service";

const Item = List.Item;
class Personinfopage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickName: "",
      nickNameError: false,
      cityName: "",
      cityNameError: false,
      birthdayName: "",
      wxNameError: false,
      wxName: "",
      heightError: false,
      height: "",
      weightError: false,
      weight: "",
      aidouError: false,
      aidou: "",
      photos: "",
      newPhoto: "",
      goPageType: "",
      userId: "",
      gender: "",
      adminUserId: "",
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.birthdayOnChange = this.birthdayOnChange.bind(this);
    this.updateHeadImg = this.updateHeadImg.bind(this);
    this.goCityPage = this.goCityPage.bind(this);
    // this.goEditPage = this.goEditPage.bind(this)
  }

  componentDidMount() {
    Taro.getStorage({
      key: "adminUserId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          this.setState({ adminUserId: res.data });
        }
      },
    });
    const {
      route: {
        params: { data, type, userId },
      },
    } = this.props;
    Taro.eventCenter.on("updatePersonInfoPageCity", (arg) => {
      if (arg?.status) {
        this.setState({ cityName: arg?.city });
      }
    });
    if (!userId) {
      Taro.getStorage({
        key: "userId",
        complete: (res) => {
          if (res.errMsg === "getStorage:ok") {
            this.setState({ userId: res.data });
          }
        },
      });
    } else {
      this.setState({ userId });
    }
    this.setState({ goPageType: type });
    if (!data) {
      personalCenter(userId)
        .then((userInfoData) => {
          if (userInfoData.statusCode === 200) {
            const userData = userInfoData.data.data;
            Taro.getStorage({
              key: "gender",
              complete: (res) => {
                if (res.errMsg === "getStorage:ok") {
                  this.setState({
                    nickName: !userData.nickName ? "" : userData.nickName,
                    wxName: !userData.wxAccount ? "" : userData.wxAccount,
                    height: !userData.height ? "" : userData.height + "",
                    weight: !userData.weight ? "" : userData.weight + "",
                    aidou: !userData.individualValues
                      ? ""
                      : userData.individualValues + "",
                    cityName: !userData.city ? "" : userData.city,
                    birthdayName: !userData.birthday ? "" : userData.birthday,
                    photos: !userData.photo ? "" : userData.photo,
                    gender: !userData.gender ? res.data : userData.gender,
                  });
                }
              },
            });
          } else {
            Toast.fail({
              content: userInfoData.data.data.msg,
              duration: 1.5,
            });
          }
        })
        .catch((error) => {
          Toast.fail({
            content: `???????????????${error}`,
            duration: 2,
          });
        });
    } else {
      const userInfo = JSON.parse(data);
      console.log(userInfo);
      this.setState({
        nickName: userInfo?.nickName + "",
        cityName: userInfo?.city + "",
        birthdayName: userInfo?.birthday === "" ? "" : userInfo?.birthday,
        wxName: !userInfo.wxAccount ? "" : userInfo.wxAccount + "",
        height: !userInfo.height ? "" : userInfo.height + "",
        weight: !userInfo.weight ? "" : userInfo.weight + "",
        aidou: !userInfo.individualValues ? "" : userInfo.individualValues + "",
        photos: !userInfo.photo ? "" : userInfo.photo + "",
        gender: userInfo?.gender + "",
      });

      Taro.eventCenter.on("updatePersonInfoPageCity", (arg) => {
        if (arg?.status) {
          this.setState({ cityName: arg?.city });
        }
      });
    }
  }

  formSubmit(e) {
    const {
      nickName,
      cityName,
      wxName,
      height,
      weight,
      aidou,
      birthdayName,
      goPageType,
      userId,
    } = this.state;
    if (!nickName) {
      Toast.fail({ content: "????????????", duration: 2 });
      return;
    }
    if (!cityName) {
      Toast.fail({ content: "??????????????????", duration: 2 });
      return;
    }
    if (!wxName) {
      Toast.fail({ content: "????????????", duration: 2 });
      return;
    }
    if (!height) {
      Toast.fail({ content: "????????????", duration: 2 });
      return;
    }
    if (!weight) {
      Toast.fail({ content: "????????????", duration: 2 });
      return;
    }
    if (!aidou) {
      Toast.fail({ content: "??????????????????", duration: 2 });
      return;
    }
    if (!birthdayName) {
      Toast.fail({
        content: "???????????????",
        duration: 1,
        mask: true,
        stackable: false,
      });
      return;
    }
    const key = Toast.loading("?????????...");
    const personData = {
      birthday: birthdayName,
      city: cityName,
      height,
      weight,
      individualValues: aidou,
      nickName,
      wxAccount: wxName,
      id: userId,
      gender: this.state.gender,
    };
    if (this.state.newPhoto) personData.photo = this.state.newPhoto;
    userSetting(personData)
      .then((data) => {
        console.log(data.data.status);
        if (data.data.status === 200) {
          Toast.remove(key);
          Toast.success({
            content: "???????????????",
            duration: 1,
          });
          if (goPageType === "signUser") {
            Taro.setStorage({
              key: "userId",
              data: userId,
              success: () => {
                Taro.switchTab({
                  url: "/pages/index/index",
                });
              },
            });
          } else {
            Taro.navigateBack({
              delta: 1,
            });
            Taro.eventCenter.trigger("refershHome", { status: true });
          }
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
          content: `???????????????${error}`,
          duration: 2,
        });
      });
  }

  updateHeadImg() {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"], // ?????????????????????????????????????????????????????????
      sourceType: ["camera"], // ??????????????????????????????????????????????????????????????????H5???????????????????????? `user` ??? `environment`??????????????????????????????
      success: (res) => {
        this.uploadImage(res.tempFilePaths);
      },
      complete: function (res) {
        // ????????????????????????????????????????????????tempFilePath????????????img?????????src??????????????????
        // this.setState({ newPhoto: res.tempFilePath[0] })
      },
    });
  }

  goCityPage() {
    this.props
      .dispatch({
        type: "home/editPersonPageGoStatus",
        payload: true,
      })
      .then(() => {
        Taro.navigateTo({
          url: `/pages/citySelect/index`,
        });
      });
  }

  // ????????????
  uploadImage(tempFilePaths) {
    const identity = this.props.route.params.identity;
    console.log(identity);

    const key = Toast.loading("??????/?????????...");
    ImagePicker.openCropper({
      path: tempFilePaths[0],
      width: 400,
      height: 400,
    })
      .then((image) => {
        console.log(image);
        const formData = new FormData();
        let file = {
          uri: image.path,
          type: "multipart/form-data",
          name: "image.jpeg",
        }; //?????????key(uri???type???name)????????????,
        formData.append("file", file);
        formData.append("tenantId", "4");
        RNFS.readFile(image.path, "base64").then((content) => {
          console.log("content", content);
          if (identity == 1) {
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
                  Toast.remove(key);
                  Toast.success({
                    content: "????????????",
                    duration: 1,
                  });
                  this.setState({
                    newPhoto: responseData.data.domain + responseData.data.path,
                  });
                }
              })
              .catch((error) => {
                console.error("error", error);
              });
          } else {
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
                  faceDetect({
                    imgUrl: "",
                    type: 2,
                    userId: this.state.userId,
                    base: this.state.goPageType === "signUser" ? content : "",
                    pictureUrl:
                      this.state.goPageType === "signUser"
                        ? ""
                        : responseData.data.domain + responseData.data.path,
                    gender: this.state.gender,
                  })
                    .then((personTrueFalsedata) => {
                      if (personTrueFalsedata.data.status === 200) {
                        Toast.remove(key);
                        Toast.success({
                          content: "????????????",
                          duration: 1,
                        });
                        this.setState({
                          newPhoto:
                            responseData.data.domain + responseData.data.path,
                        });
                      } else {
                        Toast.remove(key);
                        Toast.fail({
                          content: personTrueFalsedata.data.msg,
                          duration: 2,
                        });
                      }
                    })
                    .catch((error) => {
                      console.error("error", error);
                    });
                }
              })
              .catch((error) => {
                console.error("error", error);
              });
          }
        });
      })
      .catch(() => {
        Toast.remove(key);
      });
  }

  birthdayOnChange(value) {
    this.setState({ birthdayName: value });
  }

  // goEditPage(key) {
  //   Taro.navigateTo({
  //     url: `/pages/home/components/personInfoPage/components/editUserInfo?key=${key}`
  //   })
  // }

  render() {
    const initHeadImg =
      this.state.gender === 1
        ? "http://file.hh.darling1314.com/group1/default/20220304/10/03/6/422e8a36b47094acdb65c58c67684476.png"
        : "http://file.hh.darling1314.com/group1/default/20220304/10/04/6/287a6bdf673120f03aa1fa4735c80043.png";
    let sourceUrl;
    if (this.state.newPhoto) {
      sourceUrl = {
        uri: `${this.state.newPhoto}`,
      };
    } else if (this.state.photos) {
      sourceUrl = {
        uri: `${this.state.photos}`,
      };
    } else {
      sourceUrl = initHeadImg;
    }
    console.log(sourceUrl);
    const { adminUserId } = this.state;
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          <Item
            disabled
            extra={
              <View className="imgOutView">
                <ImageBackground
                  source={sourceUrl}
                  style={{ width: 100, height: 100 }}
                  imageStyle={{ borderRadius: 100 }}
                >
                  <Image src={editPersonImg} className="imgOnTextBottom" />
                </ImageBackground>
              </View>
            }
            onPress={this.updateHeadImg}
          >
            ??????
          </Item>
          <Item
            extra={
              <TextInput
                style={{
                  borderColor: "white",
                  width: 200,
                  height: 30,
                  textAlign: "right",
                  fontSize: 16,
                  color: "#767676",
                }}
                onChangeText={(text) => this.setState({ nickName: text })}
                value={this.state.nickName}
                clearButtonMode="while-editing"
                keyboardAppearance="default"
              />
            }
            arrow="horizontal"
          >
            ??????
          </Item>
          {adminUserId == "336" ? null : (
            <DatePicker
              value={
                !this.state.birthdayName
                  ? ""
                  : new Date(this.state.birthdayName)
              }
              mode="date"
              defaultDate={new Date()}
              minDate={new Date(1900, 7, 6)}
              maxDate={new Date(2026, 11, 3)}
              onChange={this.birthdayOnChange}
              format="YYYY-MM-DD"
            >
              <List.Item arrow="horizontal">??????</List.Item>
            </DatePicker>
          )}

          {adminUserId == "336" ? null : (
            <Item
              extra={
                <TextInput
                  style={{
                    borderColor: "white",
                    width: 200,
                    height: 30,
                    textAlign: "right",
                    fontSize: 16,
                    color: "#767676",
                  }}
                  onChangeText={(text) => this.setState({ height: text })}
                  onBlur={() =>
                    this.setState({ height: this.state.height + "" })
                  }
                  value={(this.state.height && this.state.height) || ""}
                  clearButtonMode="while-editing"
                  keyboardAppearance="default"
                  keyboardType="numeric"
                />
              }
              arrow="horizontal"
            >
              ??????
            </Item>
          )}

          {adminUserId == "336" ? null : (
            <Item
              extra={
                <TextInput
                  style={{
                    borderColor: "white",
                    width: 200,
                    height: 30,
                    textAlign: "right",
                    fontSize: 16,
                    color: "#767676",
                  }}
                  onChangeText={(text) => this.setState({ weight: text })}
                  onBlur={() =>
                    this.setState({ weight: this.state.weight + "" })
                  }
                  value={(this.state.weight && this.state.weight) || ""}
                  clearButtonMode="while-editing"
                  keyboardAppearance="default"
                  keyboardType="numeric"
                />
              }
              arrow="horizontal"
            >
              ??????
            </Item>
          )}

          {adminUserId == "336" ? null : (
            <Item
              extra={
                <TextInput
                  style={{
                    borderColor: "white",
                    width: 200,
                    height: 30,
                    textAlign: "right",
                    fontSize: 16,
                    color: "#767676",
                  }}
                  onChangeText={(text) => this.setState({ aidou: text })}
                  onBlur={() => this.setState({ aidou: this.state.aidou + "" })}
                  value={this.state.aidou || ""}
                  clearButtonMode
                  keyboardAppearance="default"
                  keyboardType="numeric"
                />
              }
              arrow="horizontal"
            >
              ????????????
            </Item>
          )}

          <Item
            disabled
            extra={this.state.cityName || ""}
            arrow="horizontal"
            onPress={this.goCityPage}
          >
            ????????????
          </Item>
          {adminUserId == "336" ? null : (
            <View
              className="myCode"
              style={{ justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <View className="mycodeLeft"></View>
                <Text className="mycodeRight">????????????</Text>
              </View>
              <Text style={{ color: "red" }}>
                *????????????????????????????????????????????????
              </Text>
            </View>
          )}

          <Item
            disabled
            extra={
              <TextInput
                style={{
                  borderColor: "white",
                  width: 200,
                  height: 30,
                  textAlign: "right",
                  fontSize: 16,
                  color: "#767676",
                }}
                onChangeText={(text) => this.setState({ wxName: text })}
                onBlur={() => this.setState({ wxName: this.state.wxName })}
                value={this.state.wxName || ""}
                clearButtonMode
                keyboardAppearance="default"
              />
            }
            arrow="horizontal"
          >
            ??????
          </Item>
        </List>
        <Image
          src={editUserInfoButtonImg}
          onClick={this.formSubmit}
          className="editUserInfoButton"
        />
      </View>
    );
  }
}

export default connect(({ home, userInfo }) => ({
  home,
  userInfo,
}))(Personinfopage);
