import Request from '../../../../utils/request';

export const feedback = (data) => {
  return Request({
    url: '/social/app/feedback',
    method: 'POST',
    data,
  });
};
