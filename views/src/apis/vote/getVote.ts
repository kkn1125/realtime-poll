import { snapApi } from '@apis/index';

export const getVote = async (id?: string) => {
  if (!id) return {};
  const { data } = await snapApi.get(`/votes/${id}`);
  return data;
};
