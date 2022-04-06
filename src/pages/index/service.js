import Request from "../../utils/request";

export const appUserList = (data) => {
  return Request({
    url: `/social/app/userList`,
    method: "POST",
    data,
  });
};

export const collectionUser = (data) => {
  return Request({
    url: `/social/app/collectionUser`,
    method: "POST",
    data,
  });
};

export const getAdListsData = () => {
  return Request({
    url: `/social/advertising/findAllByPage?pageNumber=1&&pageSize=20&usable=1`,
    method: "GET",
  });
};

export const versionApi = () => {
  return Request({
    url: "/social/version/findAllByPage?PageNumber=1&PageSize=1&type=2",
    method: "GET",
  });
};
