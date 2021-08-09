export default {
  namespace: 'jihan',
  state: {
    jihan: ['1', '2', '3'],
    twoData: true
  },
  effects: {
    // *saveData({ payload }, { call, put }) {
    //   const jihan = ['1', '2', '3', '4', '5']
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       jihan
    //     }
    //   })
    // },
    // *yincang({ payload }, { call, put }) {
    //   const twoData = payload
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       twoData
    //     }
    //   })
    // },

  },
  reducers: { // 同步方法
    save(state, {payload }) {
      return {...state, ...payload };
    },
  },
}