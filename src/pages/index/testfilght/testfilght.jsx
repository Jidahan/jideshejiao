import React, { Component, useState, useEffect, useRef } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import LottieView from "lottie-react-native";
import {
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Button, Toast } from "@ant-design/react-native";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { userListRandom } from "./service";
import matchingBg from "../../../images/matchingBg.jpg";
import pipeidu from "../../../images/pipeidu.png";
import refreshImg from "../../../images/refresh.png";
import "./index.less";

const { width } = Dimensions.get("window");

const Matching = (props) => {
  const [entries, setEntries] = useState([]);

  useDidShow(() => {
    getUserList();
  });

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {
    Taro.getStorage({
      key: "userId",
      complete: (res) => {
        if (res.errMsg === "getStorage:ok") {
          userListRandom({
            city: "",
            latitude: 0,
            longitude: 0,
            pageNumber: 0,
            pageSize: 0,
            range: 0,
            userId: "255",
            userName: "",
          }).then((data) => {
            console.log(data);
            if (data.data.status == 200) {
              setEntries(data.data.data);
            } else {
              Toast.fail({
                msg: data.data.msg,
                duration: 0.2,
              });
            }
          });
        } else {
          Taro.redirectTo({
            url: `pages/login/index`,
            complete: () => {
              Toast.fail({
                content: "登录已过期，请重新登录！",
                duration: 0.2,
              });
            },
          });
        }
      },
    });
  };

  const lookPersonPage = (item) => {
    Taro.navigateTo({
      url: `/pages/matchPerson/index?id=${item.userId}&city=${item.city}&age=${item.age}&nickName=${item.nickName}&photo=${item.photo}&compatibility=${item.compatibility}&collectionIs=${item.collectionIs}`,
    });
  };

  const refreshFunction = () => {
    getUserList();
  };

  const _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item} key={item.userId}>
        <ParallaxImage
          source={{ uri: item.photo }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.1}
          {...parallaxProps}
        />
        <View style={styles.titleContent}>
          <Text style={styles.title}>{item.nickName}</Text>
          <View style={styles.flexRow}>
            <Image src={pipeidu} style={styles.pipeidu} />
            <Text style={styles.title}>{item.compatibility + "%"}</Text>
          </View>
          <Button
            style={styles.lookButton}
            type="primary"
            onPress={() => lookPersonPage(item)}
          >
            查看
          </Button>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
      source={matchingBg}
      className="matching-page"
    >
      <LottieView
        source={require("./animation.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300, marginTop: 10 }}
        runCommand
      />
      <Image
        src={refreshImg}
        className="refreshImg"
        onClick={refreshFunction}
      />
      <View style={styles.carousel_container}>
        <Carousel
          sliderWidth={width}
          sliderHeight={width}
          itemWidth={width - 60}
          data={entries}
          renderItem={_renderItem}
          hasParallaxImages
          layout="stack"
          layoutCardOffset="18"
        />
      </View>
    </ImageBackground>
  );
};

export default Matching;
const styles = StyleSheet.create({
  carousel_container: {
    marginTop: 50,
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    width: width - 60,
    height: width - 80,
  },
  titleContent: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(208, 208, 208, .6)",
    width: "100%",
    height: 50,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    paddingLeft: 10,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  pipeidu: {
    width: 20,
    height: 20,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  lookButton: {
    marginLeft: 20,
    width: 150,
    backgroundColor: "pink",
    borderColor: "pink",
  },
});
