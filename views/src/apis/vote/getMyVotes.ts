import { snapApi } from '..';

export async function getMyVotes() {
  const param = new URLSearchParams(location.search);
  const { data } = await snapApi.get('/votes/me', {
    params: +(param.get('page') || 1),
  });
  return data;
}
