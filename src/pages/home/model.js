export default {
  namespace: 'home',
  state: {
    isPersonPageGo: false
  },
  effects: {
    *editPersonPageGoStatus({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          isPersonPageGo: payload
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