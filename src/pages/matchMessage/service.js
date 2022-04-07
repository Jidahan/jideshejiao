import Request from "../../utils/testfilghtRequest";

export const userRandomInfo = (accUserId, userId) => {
  return Request({
    url: `/darling/app/userRandomInfo?accUserId=${accUserId}&userId=255`,
    method: "GET",
  });
};

export const collectionUser = (data) => {
  return Request({
    url: `/darling/app/collectionUser`,
    method: "POST",
    data,
  });
};
