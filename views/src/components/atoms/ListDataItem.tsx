import { removePoll } from '@/apis/removePoll';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import ListItemIcons from './ListItemIcons';
import { useEffect } from 'react';

interface ListDataItemProps<T extends SnapPoll | SnapVote> {
  name: 'poll' | 'vote';
  queryKey: string;
  dataList: T[];
  count: number;
  emptyComment?: string;
}

function ListDataItem<T extends SnapPoll | SnapVote>({
  name,
  queryKey,
  dataList,
  count,
  emptyComment = '등록한 데이터가 없습니다.',
}: ListDataItemProps<T>) {
  const { openInteractiveModal } = useModal();
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams({ page: '1' });

  const removeMutate = useMutation({
    mutationKey: ['removePoll'],
    mutationFn: removePoll,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  function handleRemove(id: string) {
    openInteractiveModal(Message.Single.Remove, () => {
      removeMutate.mutate(id);
    });
  }

  const total = Math.ceil(count / 10);

  return (
    <Stack>
      <Stack direction="row">
        <Button
          component={Link}
          variant="contained"
          size="large"
          to={`/${name}s/new`}
        >
          등록하기
        </Button>
      </Stack>
      <List>
        {dataList && dataList.length > 0 ? (
          dataList.map((data) => (
            <ListItem
              key={data.id}
              disablePadding
              secondaryAction={
                data.user?.id === user?.id && (
                  <ListItemIcons
                    dataId={data.id}
                    type={name}
                    handleRemove={handleRemove}
                  />
                )
              }
              sx={{
                ['& .MuiListItemSecondaryAction-root']: {
                  transition: '150ms ease-in-out',
                  opacity: 0,
                },
                ['&:hover .MuiListItemSecondaryAction-root']: {
                  opacity: 1,
                },
              }}
            >
              <ListItemButton onClick={() => navigate(`/${name}s/${data.id}`)}>
                <ListItemText secondary={data.user?.username}>
                  {data.title}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText>{emptyComment}</ListItemText>
          </ListItem>
        )}
      </List>
      <Stack direction="row" justifyContent="center">
        <Pagination
          onChange={(e, page) => {
            if (page === 1) {
              setParams({});
            } else {
              setParams({ page: '' + page });
            }
          }}
          page={+(params.get('page') || 1)}
          count={total}
          showFirstButton
          showLastButton
        />
      </Stack>
    </Stack>
  );
}

export default ListDataItem;
