import { createSharePoll } from '@apis/poll/share/createSharePoll';
import { createShareVote } from '@apis/vote/share/createShareVote';
import { resumeShareUrl as resumeSharePollUrl } from '@apis/poll/share/resumeShareUrl';
import { resumeShareUrl as resumeShareVoteUrl } from '@apis/vote/share/resumeShareUrl';
import { revokeShareUrl as revokeSharePollUrl } from '@apis/poll/share/revokeShareUrl';
import { revokeShareUrl as revokeShareVoteUrl } from '@apis/vote/share/revokeShareUrl';
import { Message } from '@common/messages';
import { BASE_CLIENT_URL } from '@common/variables';
import useModal from '@hooks/useModal';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { Button, Chip, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ShareControlButtonProps {
  data?: SnapPoll | SnapVote;
  user?: Pick<User, 'id' | 'email' | 'username' | 'userProfile'>;
  refetch: () => void;
}
const ShareControlButton: React.FC<ShareControlButtonProps> = ({
  data,
  user,
  refetch,
}) => {
  const [copy, setCopy] = useState(false);
  const [createPublicUrl, setCreatePublicUrl] = useState(false);
  const { openModal } = useModal();
  const name = data ? ('sharePoll' in data ? 'poll' : 'vote') : undefined;
  const share = data
    ? 'sharePoll' in data
      ? (data as SnapPoll).sharePoll
      : (data as SnapVote).shareVote
    : undefined;

  const handleCopyUrl = useCallback(() => {
    if (share) {
      navigator.clipboard
        .writeText(
          `${BASE_CLIENT_URL}/service/${name}/share/?url=${encodeURIComponent(share.url)}`,
        )
        .then(() => {
          setCopy(true);
          setTimeout(() => {
            setCopy(false);
          }, 3000);
        });
    }
  }, [name, share]);

  const createPublicUrlMutation = useMutation({
    mutationKey: ['createPublicUrl'],
    mutationFn: name === 'poll' ? createSharePoll : createShareVote,
    onSuccess(data, variables, context) {
      // console.log(data);
      if (data) {
        openModal({ info: Message.Info.CreateShareUrl });
        refetch();
        setTimeout(() => {
          setCreatePublicUrl(false);
        }, 3000);
      }
    },
  });

  const resumePublicUrlMutation = useMutation({
    mutationKey: ['resumePublicUrl'],
    mutationFn: name === 'poll' ? resumeSharePollUrl : resumeShareVoteUrl,
    onSuccess(data, variables, context) {
      // console.log(data);
      if (data) {
        openModal({ info: Message.Info.ResumeShareUrl });
        refetch();
        setTimeout(() => {
          setCreatePublicUrl(false);
        }, 3000);
      }
    },
  });

  const revokePublicUrlMutation = useMutation({
    mutationKey: ['revokePublicUrl'],
    mutationFn: name === 'poll' ? revokeSharePollUrl : revokeShareVoteUrl,
    onSuccess(data, variables, context) {
      // console.log(data);
      if (data) {
        openModal({ info: Message.Info.RevokeShareUrl });
        refetch();
        setTimeout(() => {
          setCreatePublicUrl(false);
        }, 3000);
      }
    },
  });

  const handleCreatePublicUrl = useCallback((pollId: string) => {
    setCreatePublicUrl(true);
    createPublicUrlMutation.mutate(pollId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResumePublicUrl = useCallback((id: string) => {
    resumePublicUrlMutation.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRevokePublicUrl = useCallback((id: string) => {
    revokePublicUrlMutation.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data || !user || data.user?.id !== user.id) return <></>;

  return (
    user.id === data.user.id &&
    (!share ? (
      <Stack>
        <Button
          size="small"
          startIcon={<ShareIcon />}
          onClick={() => handleCreatePublicUrl(data.id)}
        >
          공유 URL 생성하기
        </Button>
      </Stack>
    ) : share.deletedAt !== null ? (
      <Button
        color="warning"
        size="small"
        onClick={() => handleResumePublicUrl(share.id)}
      >
        공유 URL 복구하기
      </Button>
    ) : (
      <Stack direction="column" alignItems="flex-end">
        <Chip
          component={Link}
          size="small"
          color="info"
          to={`${BASE_CLIENT_URL}/service/${name}/share/?url=${encodeURIComponent(share.url)}`}
          label={`/service/share/${name}/?url=${encodeURIComponent(share.url)}`}
          sx={{
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '50vw',
          }}
        />
        <Button
          color={copy ? 'success' : 'inherit'}
          size="small"
          startIcon={copy ? <CheckCircleIcon /> : <ContentCopyIcon />}
          onClick={handleCopyUrl}
        >
          공유 URL 복사
        </Button>
        <Button
          color="error"
          size="small"
          onClick={() => handleRevokePublicUrl(share.id)}
        >
          공유 URL 정지하기
        </Button>
      </Stack>
    ))
  );
};

export default ShareControlButton;
