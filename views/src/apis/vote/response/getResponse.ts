import { snapApi } from '@/apis';

export const getResponse = async (responseId?: string) => {
  if (!responseId) return {};
  const { data } = await snapApi.get(`/votes/response/${responseId}`);
  return data;
};