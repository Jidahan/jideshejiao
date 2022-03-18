import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { Toast, Carousel } from "@ant-design/react-native";
import { StyleSheet } from "react-native";
import adImg from "../../../images/ad.png";
import { getAdListsData } from "../service";

const AdLists = (props) => {
  const [adLists, setAdLists] = useState([]);

  useEffect(() => {
    getAdListsData()
      .then((data) => {
        if (data.data.status === 200) {
          setAdLists(data.data.data.records);
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
  }, []);

  const adClick = (url) => {
    Taro.navigateTo({
      url: `/pages/adPage/index?url=${url}`,
    });
  };

  return (
    <Carousel style={styles.wrapper} autoplay infinite dots={false}>
      {adLists ? (
        adLists &&
        adLists.map((reward) => {
          return (
            <View key={reward.id} style={{ height: 150 }}>
              <Image
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 10,
                }}
                src={reward.cover}
                onClick={() => adClick(reward.url)}
                mode="aspectFill"
              />
            </View>
          );
        })
      ) : (
        <View style={{ height: 150 }}>
          <Image
            style={{ width: "100%", height: 150, borderRadius: 10 }}
            src={adImg}
            onClick={() => adClick("https://www.baidu.com")}
          />
        </View>
      )}
    </Carousel>
  );
};

export default AdLists;

const styles = StyleSheet.create({
  wrapper: {
    height: 120,
  },
});
