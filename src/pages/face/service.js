import Request from '../../utils/request';
import baseUrl from '../../utils/baseUrl';

export const uploadUrl = `${baseUrl}/social/file/upload`

export const faceDetect = (data) => {
  return Request({
    url: `/social/app/faceDetect/`,
    method: 'POST',
    data
  });
};
