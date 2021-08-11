import * as payPageApi from './service';

export default {
  namespace: 'payPage',
  state: {

  },

  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(payPageApi.demo, {});
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
