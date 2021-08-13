import Request from '../../utils/request';

export const appUserList = (data) => {
  return Request({
    url: `/social/app/userList`,
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


