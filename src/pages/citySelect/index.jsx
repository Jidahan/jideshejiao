import { Component } from 'react'
import { View } from '@tarojs/components'
// import { province } from 'antd-mobile-demo-data';
import { StickyContainer, Sticky } from 'react-sticky';
import { ListView, List, SearchBar } from '@ant-design/react-native'

const { Item } = List;

function genData(ds, provinceData) {
  const dataBlob = {};
  const sectionIDs = [];
  const rowIDs = [];
  Object.keys(provinceData).forEach((item, index) => {
    sectionIDs.push(item);
    dataBlob[item] = item;
    rowIDs[index] = [];

    provinceData[item].forEach((jj) => {
      rowIDs[index].push(jj.value);
      dataBlob[jj.value] = jj.label;
    });
  });
  return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
}
const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];


class citySelect extends Component {

  constructor(props) {
    super(props);
    

    this.state = {
      inputValue: '',
      dataSource: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    // simulate initial Ajax
    setTimeout(() => {
      this.setState({
        dataSource: genData(this.state.dataSource),
        isLoading: false,
      });
    }, 600);
  }

  onSearch = (val) => {
    const pd = { };
    Object.keys(pd).forEach((item) => {
      const arr = pd[item].filter(jj => jj.spell.toLocaleLowerCase().indexOf(val) > -1);
      if (!arr.length) {
        delete pd[item];
      } else {
        pd[item] = arr;
      }
    });
    this.setState({
      inputValue: val,
      dataSource: genData(this.state.dataSource, pd),
    });
  }

  render() {
    return (<View style={{ paddingTop: '44px', position: 'relative' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <SearchBar
          value={this.state.inputValue}
          placeholder='Search'
          onChange={this.onSearch}
          onClear={() => { console.log('onClear'); }}
          onCancel={() => { console.log('onCancel'); }}
        />
      </View>
      <ListView.IndexedList
        dataSource={this.state.dataSource}
        className='am-list sticky-list'
        useBodyScroll
        renderSectionWrapper={sectionID => (
          <StickyContainer
            key={`s_${sectionID}_c`}
            className='sticky-container'
            style={{ zIndex: 4 }}
          />
        )}
        renderSectionHeader={sectionData => (
          <Sticky>
            {({
              style,
            }) => (
              <View
                className='sticky'
                style={{
                  ...style,
                  zIndex: 3,
                  backgroundColor: sectionData.charCodeAt(0) % 2 ? '#5890ff' : '#F8591A',
                  color: 'white',
                }}
              >{sectionData}</View>
            )}
          </Sticky>
        )}
        renderHeader={() => <span>custom header</span>}
        renderFooter={() => <span>custom footer</span>}
        renderRow={rowData => (<Item>{rowData}</Item>)}
        quickSearchBarStyle={{
          top: 85,
        }}
        delayTime={10}
        delayActivityIndicator={<View style={{ padding: 25, textAlign: 'center' }}>rendering...</View>}
      />
    </View>);
  }
}

export default citySelect