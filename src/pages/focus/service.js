import Request from '../../utils/request';

export const myFollowList = (data) => {
  return Request({
    url: `/social/app/myFollowList`,
    method: 'POST',
    data
  });
};

