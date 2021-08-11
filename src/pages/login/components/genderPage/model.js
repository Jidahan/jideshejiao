
export default {
  namespace: 'genderPage',
  state: {

  },

  effects: {
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
