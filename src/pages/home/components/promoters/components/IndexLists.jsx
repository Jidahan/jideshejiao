import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import {
  Flex,
  WhiteSpace,
  WingBlank,
  Button,
  Card,
  SearchBar,
  Toast,
  List,
} from "@ant-design/react-native";
import dkTimeImg from "../../../../../images/dk_time.png";

import "../index.less";

const IndexLists = (props) => {
  const {
    data: { item },
  } = props;
  console.log(item);
  return (
    <WingBlank style={{ marginBottom: 5 }}>
      <View key={item.userId} className="cardContent">
        <View className="leftTopContent">
          <View>{item.address}</View>
          <View className="leftContent">
            <Image src={dkTimeImg} className="timeImg" />
            <Text style={{ marginLeft: 5, color: "#787878" }}>
              {item.createTime}
            </Text>
          </View>
        </View>
        <FastImage
          style={{ width: 80, height: 80, borderRadius: 10 }}
          source={{
            uri: `${item.photo}`,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    </WingBlank>
  );
};

export default IndexLists;

const styles = StyleSheet.create({});
