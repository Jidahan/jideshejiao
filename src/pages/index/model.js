export default {
  namespace: 'jihan',
  state: {
    jihan: ['1', '2', '3']
  },
  effects: {
    *saveData({ payload }, { call, put }) {
      const jihan = ['1', '2', '3', '4']
      yield put({
        type: 'save',
        payload: {
          jihan
        }
      })
    },
    *editData({ payload }, { call, put }) {
      const jihan = payload
      yield put({
        type: 'save',
        payload: {
          jihan
        }
      })
    },

  },
  reducers: { // 同步方法
    save(state, {payload }) {
      return {...state, ...payload };
    },
  },
}