import { Component } from "react";
import { View, Image } from "@tarojs/components";
import FastImage from "react-native-fast-image";
import Taro from "@tarojs/taro";
import {
  Flex,
  WhiteSpace,
  WingBlank,
  Button,
  Card,
  SearchBar,
  Toast,
} from "@ant-design/react-native";
import ImagePicker from "react-native-image-crop-picker";
import dkButton from "../../../../images/dk.png";
import dkAgainButton from "../../../../images/dk_again.png";
import "./index.less";
import { promoterClockIn, uploadUrl } from "./service";

class Promotersdk extends Component {
  constructor(props) {
    super(props);
    this.state = { photo: "", promoterId: "", name: "", tel: "", nowTime: "" };
  }

  componentDidMount() {
    const that = this;
    Taro.getLocation({
      type: "wgs84",
      success: function (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;

        Taro.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=XKYBZ-36R6D-DP74D-PFWPH-PICQ5-RHFJS`,
          header: {
            "Content-Type": "application/json",
          },
          method: "GET",
          complete: (resCity) => {
            console.log("resCity", resCity);
            if (resCity.statusCode === 200) {
              const myDate = new Date();
              console.log("resCity.data.result", resCity.data.result);
              that.setState({
                address: resCity.data.result.address,
                photo: that.props.route.params.photo,
                promoterId: that.props.route.params.promoterId,
                name: that.props.route.params.name,
                tel: that.props.route.params.tel,
                nowTime:
                  myDate.getFullYear() +
                  "-" +
                  (myDate.getMonth() < 10
                    ? "0" + (myDate.getMonth() + 1)
                    : myDate.getMonth() + 1) +
                  "-" +
                  (myDate.getDate() < 10
                    ? "0" + myDate.getDate()
                    : myDate.getDate()) +
                  " " +
                  (myDate.getHours() < 10
                    ? "0" + myDate.getHours()
                    : myDate.getHours()) +
                  ":" +
                  (myDate.getMinutes() < 10
                    ? "0" + myDate.getMinutes()
                    : myDate.getMinutes()) +
                  ":" +
                  (myDate.getSeconds() < 10
                    ? "0" + myDate.getSeconds()
                    : myDate.getSeconds()),
              });
            } else {
              Toast.fail({
                content: "定位失败",
                duration: 2,
              });
            }
          },
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  goDkClick() {
    const key = Toast.loading("打卡中...");
    promoterClockIn({
      address: this.state.address,
      name: this.state.name,
      photo: this.state.photo,
      promoterId: this.state.promoterId,
      tel: this.state.tel,
    })
      .then((data) => {
        if (data.statusCode === 200) {
          Toast.remove(key);
          Toast.success({
            content: "打卡成功！",
            duration: 2,
          });
          Taro.navigateBack({
            delta: 1,
          });
          Taro.eventCenter.trigger("refreshData", {
            status: true,
          });
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

  againPhoto() {
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
            that.setState({
              photo: responseData.data.domain + responseData.data.path,
            });
          }
        })
        .catch((error) => {
          Toast.fail({
            content: `遇到了错误${error}`,
            duration: 2,
          });
        });
    });
  }

  render() {
    return (
      <WingBlank>
        <WhiteSpace size="lg" />
        <FastImage
          style={{ width: "100%", height: 400, borderRadius: 10 }}
          source={{
            uri: this.state.photo,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View className="cardContent">
          <View style={{ fontWeight: "bold" }}>打卡地点：</View>
          <View style={{ marginTop: 5, color: "rgb(50, 50, 50)" }}>
            {this.state.address}
          </View>

          <View style={{ fontWeight: "bold", marginTop: 20 }}>打卡时间：</View>
          <View style={{ marginTop: 5, color: "rgb(50, 50, 50)" }}>
            {this.state.nowTime}
          </View>
        </View>

        <View className="bottomView">
          <Image
            src={dkAgainButton}
            className="bottomButton"
            onClick={() => this.againPhoto()}
          />
          <Image
            src={dkButton}
            className="bottomButton"
            onClick={() => this.goDkClick()}
          />
        </View>
      </WingBlank>
    );
  }
}

export default Promotersdk;
// 下面用来connect数据层
// export default connect(
//   ({
//     promotersDk,
//   }) => ({
//     promotersDk,
//   }),
// )(Promotersdk);
