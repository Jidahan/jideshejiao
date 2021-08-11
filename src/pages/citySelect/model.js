import * as citySelectApi from './service';

export default {
  namespace: 'citySelect',
  state: {

  },

  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(citySelectApi.demo, {});
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
