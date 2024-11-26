import { Poll } from '@utils/Poll';
import { atom } from 'recoil';

export default atom<{ polls: Poll<'text' | 'option' | 'checkbox'>[] }>({
  key: 'snapPoll',
  default: {
    polls: [],
  },
});
