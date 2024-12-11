import Notfound from '@pages/Notfound';
import SharePoll from '@pages/polls/share/SharePoll';
import ShareVote from '@pages/votes/share/ShareVote';
import { useSearchParams } from 'react-router-dom';

interface SharePageProps {}
const SharePage: React.FC<SharePageProps> = () => {
  const [param] = useSearchParams({ url: '' });
  const url = param.get('url');
  const name = url?.slice(7, url?.indexOf('-', 7));

  if (!url) return <Notfound comment="잘못된 요청입니다." />;

  switch (name) {
    case 'poll':
      return <SharePoll url={url} />;
    case 'vote':
      return <ShareVote url={url} />;
    default:
      return <Notfound comment="잘못된 요청입니다." />;
  }
};

export default SharePage;