import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { StyleSheet } from "react-native";
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

import "../../index/index.less";

const IndexLists = (props) => {
  const {
    data: { item },
  } = props;

  const click = (id) => {
    Taro.navigateTo({
      url: `/pages/userInfo/index?id=${id}`,
    });
  };
  return (
    <WingBlank style={{ marginBottom: 5 }}>
      <View onClick={() => click(item.userId)} key={item.userId}>
        <Card full>
          <Card.Header
            title={item.nickName + "(" + item.distance + ")"}
            thumbStyle={{ width: 30, height: 30 }}
            thumb={`${item.photo}?width=30&height=0`}
            extra=">"
          />

          <Card.Footer content={item.visitTime} extra={item.city} />
        </Card>
      </View>
    </WingBlank>
  );
};

export default IndexLists;

const styles = StyleSheet.create({});
