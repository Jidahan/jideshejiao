import { create } from 'dva-core';
import createLoading from 'dva-loading';
import { createLogger } from "redux-logger";

let app
let store
let dispatch
let registered

function createApp(opt) {

  // redux日志, 引用redux-logger
  opt.onAction = [createLogger()];
  app = create(opt);
  app.use(createLoading({}));


  if (!registered) opt.models.forEach((model) => app.model(model));
  registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;
  app.use({
    onError(err) {
      console.log(err)
    }
  });

  dispatch = store.dispatch;
  app.dispatch = dispatch;
  return app;
}

export default {
  createApp,
  getDispatch() {
    return app.dispatch;
  },
  // getStore() { // 这个是在非组件的文件中获取Store的方法, 不需要可以不暴露
  //   return app.getStore();
  // },
};


