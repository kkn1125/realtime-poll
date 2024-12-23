import { snapApi } from '..';

export const getBoardAllList = async (page: number = 1) => {
  const { data } = await snapApi.get('/boards', { params: { page } });
  return data;
};