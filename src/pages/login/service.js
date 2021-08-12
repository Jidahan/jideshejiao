import Request from '../../utils/request';

export const getPhoneSendCode = (data) => {
  return Request({
    url: `/social/app/sendCode?tel=${data}`,
    method: 'GET',
  });
};

export const appLogin = (data) => {
  return Request({
    url: `/social/app/login`,
    method: 'POST',
    data
  });
};

