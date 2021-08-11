import * as historyVisitApi from './service';

export default {
  namespace: 'historyVisit',
  state: {

  },

  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(historyVisitApi.demo, {});
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
