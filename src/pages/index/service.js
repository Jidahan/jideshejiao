import Request from '../../utils/request';

export const appUserList = (data) => {
  return Request({
    url: `/social/web/appUserList`,
    method: 'POST',
    data
  });
};


