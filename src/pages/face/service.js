import Request from "../../utils/request";
import baseUrl from "../../utils/baseUrl";

export const uploadUrl = `${baseUrl}/social/file/faceDectByIos`;
// export const uploadUrl = `http://192.168.3.49:9010/file/upload`

export const faceDetect = (data) => {
  return Request({
    url: `/social/app/faceDetect/`,
    method: "POST",
    data,
  });
};
