import * as photoListsApi from './service';

export default {
  namespace: 'photoLists',
  state: {

  },

  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(photoListsApi.demo, {});
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
