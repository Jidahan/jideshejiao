import Request from '../../utils/request';

export const personalCenter = (id) => {
  return Request({
    url: `/social/app/personalCenter?userId=${id}`,
    method: 'GET',
  });
};
