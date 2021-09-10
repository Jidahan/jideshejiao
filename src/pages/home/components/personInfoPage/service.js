import Request from '../../../../utils/request';
import baseUrl from '../../../../utils/baseUrl';

export const userSetting = (data) => {
  return Request({
    url: `/social/app/userSetting`,
    method: 'POST',
    data
  });
};

export const uploadUrl = `${baseUrl}/file/file/upload`

export const fileUpload = (data) => {
  return Request({
    url: `/social/app/fileUpload`,
    method: 'POST',
    data
  });
};

export const faceDetect = (data) => {
  return Request({
    url: `/social/app/faceDetect/`,
    method: 'POST',
    data
  });
};

export const personalCenter = (id) => {
  return Request({
    url: `/social/app/personalCenter?userId=${id}`,
    method: 'GET',
  });
};

