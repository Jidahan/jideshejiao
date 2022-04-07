import { Component, useState, useCallback, useEffect } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import FastImage from "react-native-fast-image";
import { Toast } from "@ant-design/react-native";
import { ProgressView } from "@react-native-community/progress-view";
import positionImg from "../../images/indexposition.png";
import hotImg from "../../images/hot.png";
import selectHeartImg from "../../images/selectHeart.png";
import heartImg from "../../images/heart.png";
import { userRandomInfo, collectionUser } from "./service";

import "./index.less";

const Matchmessage = (props) => {
  const { mePhoto, photo, compatibility, id, userId, collectionIs } =
    props.route.params;
  const [pageData, setPageData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  console.log("collectionIs", collectionIs);

  useEffect(() => {
    setIsLike(collectionIs == 2 ? true : false);
  }, []);
  useDidShow(() => {
    userRandomInfo(id, userId).then((data) => {
      if (data.data.status == 200) {
        setPageData(data.data.data);
      } else {
        Toast.fail({
          content: data.data.msg,
          duration: 0.5,
        });
      }
    });
  });

  const likeThisUser = useCallback(() => {
    collectionUser({ otherUserId: id, userId }).then((data) => {
      if (data.data.status === 200) {
        if (data.data.data == "关注成功") {
          setIsLike(true);
        } else {
          setIsLike(false);
        }
        Toast.success({
          content: data.data.data,
          duration: 0.5,
        });
      } else {
        Toast.fail({
          content: data.data.msg,
          duration: 0.5,
        });
      }
    });
  }, [id, userId]);
  console.log("collectionIscollectionIs", collectionIs);
  console.log("likelikelikelike", isLike);
  return (
    <View className="matchMessage-page">
      <View className="content">
        <View className="flexRow" style={{ justifyContent: "space-around" }}>
          <FastImage
            source={{
              uri: `${mePhoto}`,
              priority: FastImage.priority.normal,
            }}
            className="img"
            resizeMode={FastImage.resizeMode.cover}
          />
          <View className="topCenterContent">
            <ProgressView
              progressTintColor="#ff213b"
              trackTintColor="#eee"
              progress={Number(compatibility) / 100}
              style={{ width: 100 }}
            />
            <Text style={{ color: "#ff213b", marginTop: 10 }}>
              匹配度{compatibility}%
            </Text>
          </View>

          <FastImage
            source={{
              uri: `${photo}`,
              priority: FastImage.priority.normal,
            }}
            className="img"
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View className="headBottomView">
          <View className="flexRow">
            <Image src={positionImg} className="positionImg" />
            <Text>TA距离你{pageData?.distance}</Text>
          </View>
          <View className="flexRow" style={{ marginTop: 5 }}>
            <Image src={hotImg} className="positionImg" />
            <Text style={{ color: "#ff213b" }}>{pageData?.hotTitle}</Text>
          </View>
        </View>
        <View className="bottomView">
          <Text className="baziText" style={{ marginTop: 30 }}>
            我的八字：{pageData?.userEightInfo}
          </Text>
          <Text className="baziText">
            TA的八字：{pageData?.randomUserEightInfo}
          </Text>
          <ScrollView className="bottomContentView">
            <Text className="baziContent">{pageData?.randomInfo}</Text>
            <Image
              src={isLike ? selectHeartImg : heartImg}
              className="heartImg"
              onClick={likeThisUser}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
export default Matchmessage;
// 下面用来connect数据层
// export default connect(
//   ({
//     matchMessage,
//   }) => ({
//     matchMessage,
//   }),
// )(Matchmessage);
