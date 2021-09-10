import Request from '../../utils/request';

export const getUserPhotos = (data) => {
  return Request({
    url: '/social/app/getUserPhotos',
    method: 'POST',
    data,
  });
};

export const delUserData = (data) => {
  return Request({
    url: '/social/app/delUserData',
    method: 'POST',
    data,
  });
};