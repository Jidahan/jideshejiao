import * as resetPasswordApi from './service';

export default {
  namespace: 'resetPassword',
  state: {

  },

  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(resetPasswordApi.demo, {});
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
