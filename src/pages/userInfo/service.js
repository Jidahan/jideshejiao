import Request from '../../utils/request';

export const appUserDetail = (data) => {
  return Request({
    url: `/social/app/userDetails`,
    method: 'POST',
    data
  });
};

export const evaluateUsers = (data) => {
  return Request({
    url: `/social/app/evaluateUsers`,
    method: 'POST',
    data
  });
};



