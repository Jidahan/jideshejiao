import Request from "../../../../utils/request";
import baseUrl from "../../../../utils/baseUrl";

export const promoterClockIn = (data) => {
  return Request({
    url: "/social/extend/promoterClockIn",
    method: "POST",
    data,
  });
};
export const uploadUrl = `${baseUrl}/file/file/upload`;
