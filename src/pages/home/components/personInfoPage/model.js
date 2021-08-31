export default {
  namespace: 'userInfo',
  state: {
    nickName: '',
    height: '',
    weight: '',
    aidou: '',
    wx: ''
  },
  effects: {
    *editPersonNickName({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          nickName: payload
        }
      })
      callback('200')
    },
    *editPersonHeight({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          height: payload
        }
      })
      callback('200')
    },
    *editPersonWeight({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          weight: payload
        }
      })
      callback('200')
    },
    *editPersonAidou({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          aidou: payload
        }
      })
      callback('200')
    },
    *editPersonwx({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          wx: payload
        }
      })
      callback('200')
    },
    *returnAllState({ payload, callback },{call, put, select}){
      const stateValue = yield select(state => state);
      callback(stateValue.userInfo)
    }
  },
  reducers: { // 同步方法
    save(state, {payload }) {
      return {...state, ...payload };
    },
  },
}