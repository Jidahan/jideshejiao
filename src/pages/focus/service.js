import Request from '../../utils/request';

export const myFollowList = (data) => {
  return Request({
    url: `/social/app/myFollowList`,
    method: 'POST',
    data
  });
};

export const collectionUser = (data) => {
  return Request({
    url: `/social/app/collectionUser`,
    method: 'POST',
    data
  });
};

