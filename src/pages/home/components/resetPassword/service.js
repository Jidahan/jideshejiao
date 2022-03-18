import Request from "../../../../utils/request";

export const getPhoneSendCode = (data) => {
  return Request({
    url: `/social/app/sendCode?tel=${data}`,
    method: "GET",
  });
};

export const updatePassword = (data) => {
  return Request({
    url: `/social/app/updatePassword`,
    method: "POST",
    data,
  });
};
