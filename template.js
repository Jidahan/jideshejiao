 /**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

// 页面模版
const indexTep = `import { Component } from 'react';
import { View } from '@tarojs/components';
import { connect } from 'react-redux';
import './index.less';

class ${titleCase(dirName)} extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() { }

  render() {
    return (
      <View className="${dirName}-page">
        ${dirName}
      </View>
    )
  }
}

export default ${titleCase(dirName)}
// 下面用来connect数据层
// export default connect(
//   ({
//     ${dirName},
//   }) => ({
//     ${dirName},
//   }),
// )(${titleCase(dirName)});
`;

// less文件模版
const lessTep = `
.${dirName}-page {
  
}
`;

// model文件模版
const modelTep = `import * as ${dirName}Api from './service';

export default {
  namespace: '${dirName}',
  state: {

  },

  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(${dirName}Api.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
`;


// service页面模版
const serviceTep = `import Request from '../../utils/request';

export const demo = (data) => {
  return Request({
    url: '路径',
    method: 'POST',
    data,
  });
};
`;

// config页面模版
const configTep = `export default {
  navigationBarTitleText: '${dirName}'
}`;



fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync('index.jsx', indexTep);
fs.writeFileSync('index.less', lessTep);
fs.writeFileSync('model.js', modelTep);
fs.writeFileSync('service.js', serviceTep);
fs.writeFileSync('index.config.js', configTep);

console.log(`模版${dirName}已创建,请手动增加models`);

function titleCase(str) {
  const array = str.toLowerCase().split(' ');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(' ');
  return string;
}

process.exit(0);
