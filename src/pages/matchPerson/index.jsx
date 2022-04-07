import { Component, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import {
  ImageBackground,
  StyleSheet,
  ScrollScrollView,
  ScrollView,
  Dimensions,
  Platform,
  Easing,
} from "react-native";
import { Toast } from "@ant-design/react-native";

import FastImage from "react-native-fast-image";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import matchingBg from "../../images/matchingBg.jpg";
import flowerImg from "../../images/flower.png";
import yuanImg from "../../images/yuan.png";
import { getUserInfo } from "./service";
import "./index.less";

const Matchperson = (props) => {
  const circleRef = useRef(null);
  const {
    params: { age, city, id, nickName, photo, compatibility, collectionIs },
  } = props.route;
  const [fillValue, setFillValue] = useState(0);
  const [mePhoto, setMePhoto] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg == "getStorage:ok") {
          getUserInfo(res.data).then((data) => {
            if (data.data.status == 200) {
              setMePhoto(data.data.data.photo);
              setUserId(res.data);
            } else {
              Toast.fail({
                content: `获取用户信息失败！描述：${data.data.msg}`,
                duration: 0.5,
              });
            }
          });
        }
      },
    });
  }, []);

  const showCircularContent = () => {
    setFillValue(100);
    // let value = 0;
    // const timeer = setInterval(() => {
    //   if (value >= 100) {
    //     clearInterval(timeer);
    //     return;
    //   } else {
    //     setFillValue(value++);
    //   }
    // }, 1);
  };

  const onAnimationComplete = () => {
    Taro.redirectTo({
      url: `/pages/matchMessage/index?id=${id}&userId=${userId}&photo=${photo}&compatibility=${compatibility}&mePhoto=${mePhoto}&collectionIs=${collectionIs}`,
    });
  };

  return (
    <ImageBackground
      style={{
        flex: 1,
        alignItems: "center",
        // justifyContent: "space-between",
        flexDirection: "column",
      }}
      source={matchingBg}
    >
      <FastImage
        source={{
          uri: `${photo}`,
          priority: FastImage.priority.normal,
        }}
        className="img"
        resizeMode={FastImage.resizeMode.cover}
      />
      <View className="flexRow">
        <Text>{city}</Text>
        <Text className="userInfoText">{age}岁</Text>
      </View>
      <Text className="flexRow">{nickName}</Text>
      <View className="flexRow">
        <Image src={flowerImg} className="flower" />
        <Text>爱生活，爱让我们在一起...</Text>
      </View>
      {fillValue <= 0 ? null : (
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={fillValue}
          prefill={0}
          tintColor="pink"
          onAnimationComplete={onAnimationComplete}
          backgroundColor="#eeeeee"
          ref={circleRef}
          style={styles.circleMap}
        >
          {(fill) => <Text style={styles.circleText}>{fillValue}%</Text>}
        </AnimatedCircularProgress>
      )}

      <Image
        src={yuanImg}
        className="yuanButton"
        onClick={showCircularContent}
      />
    </ImageBackground>
  );
};

export default Matchperson;

const styles = StyleSheet.create({
  circleMap: {
    marginTop: 20,
  },
  circleText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});

// 下面用来connect数据层
// export default connect(
//   ({
//     matchPerson,
//   }) => ({
//     matchPerson,
//   }),
// )(Matchperson);
