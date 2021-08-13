import Request from '../../../../utils/request';

export const userSetting = (data) => {
  return Request({
    url: `/social/app/userSetting`,
    method: 'POST',
    data
  });
};