import Request from "../../utils/testfilghtRequest";

export const getUserInfo = (id) => {
  return Request({
    url: `/darling/app/personalCenter?userId=255`,
    method: "GET",
  });
};
