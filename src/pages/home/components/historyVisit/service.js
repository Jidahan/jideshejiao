import Request from '../../../../utils/request';

export const findHistoricalVisitors = (data) => {
  return Request({
    url: `/social/app/findHistoricalVisitors`,
    method: 'POST',
    data
  });
};
