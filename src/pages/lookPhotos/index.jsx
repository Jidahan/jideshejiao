import { PureComponent } from 'react';
import { Carousel } from '@ant-design/react-native';
import { StyleSheet, SafeAreaView } from 'react-native';
import { View, Image, Video } from '@tarojs/components'


import './index.less';

class Lookphotos extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      photos: [],
      key: ''
    }
  }

  componentDidMount() { 
    const { route:{params:{data, key}} } = this.props
    this.setState({ photos: data&&JSON.parse(data), key })
  }

  render() {
    const { photos, key } = this.state
    console.log(key);
    return (
      <SafeAreaView style={styles.container}>
        <Carousel
          style={styles.wrapper}
          selectedIndex={0}
          infinite
        >
          {photos.map(reward => {
            if(reward.type === 1){
              return (
                <View key={reward.id} style={[styles.containerHorizontal]}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    src={reward.url}
                    className='filterImg'
                  />
                </View>
              )
            }else{
              return (
                <View key={reward.id} style={[styles.containerHorizontal]}>
                  <Video
                    style={{width: '100%', height: '100%'}}
                    src={reward.url}
                    autoplay={false}
                    loop={false}
                    poster={reward.videoUrl}
                    // controls={false}
                    showCenterPlayBtn={false}
                    objectFit='fill'
                  />
                </View>
              )
            }
          })}
        </Carousel>
      </SafeAreaView>
    )
  }
}

export default Lookphotos

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    height: '100%'
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});


// 下面用来connect数据层
// export default connect(
//   ({
//     lookPhotos,
//   }) => ({
//     lookPhotos,
//   }),
// )(Lookphotos);
