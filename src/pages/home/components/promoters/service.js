import Request from "../../../../utils/request";
import baseUrl from "../../../../utils/baseUrl";

export const recordConditionsQuery = (data) => {
  return Request({
    url: `/social/extend/recordConditionsQuery?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&promoterId=${data.promoterId}`,
    method: "GET",
  });
};

export const uploadUrl = `${baseUrl}/file/file/upload`;
