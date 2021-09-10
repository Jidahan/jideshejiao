import Request from '../../utils/request';

export const payCallBack = (data) => {
  return Request({
    url: `/social/app/payCallBack`,
    method: 'POST',
    data
  });
};

export const createOrderPayByGoodsId = (data) => {
  return Request({
    url: `/social/app/createOrderPayByGoodsId`,
    method: 'POST',
    data
  });
};