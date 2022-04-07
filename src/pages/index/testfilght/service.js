import Request from "../../../utils/testfilghtRequest";

export const userListRandom = (data) => {
  return Request({
    url: "/darling/app/userListRandom",
    method: "POST",
    data,
  });
};
