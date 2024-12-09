import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Poll } from '@utils/Poll';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import PollDesc from '@components/atoms/PollDesc';
import useModal from '@hooks/useModal';
import { Message } from '@common/messages';

interface PollOptionItemProps {
  index: number;
  poll: Poll<PollType['type']>;
  updatePoll: (poll: Poll<PollType['type']>) => void;
  // addErrors: (pollId: string, itemIndex: number, cause: string) => void;
  // deleteErrors: (pollId: string) => void;
  handleDeletePoll: (pollId: string) => void;
  setErrors: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          itemIndex: number;
          cause: string;
        }
      >
    >
  >;
  errors: Record<string, { itemIndex: number; cause: string }>;
}
const PollOptionItem: React.FC<PollOptionItemProps> = ({
  index,
  poll,
  updatePoll,
  handleDeletePoll,
  setErrors,
  errors,
}) => {
  const { openInteractiveModal } = useModal();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      const checked = target.checked;

      Object.assign(poll, { [name]: name === 'required' ? checked : value });
      updatePoll(poll);
    },
    [poll, updatePoll],
  );

  function onSelectChange(e: SelectChangeEvent) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    Object.assign(poll, { [name]: value });
    updatePoll(poll);
  }

  function onChangeItemName(index: number) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const target = e.target;
      // poll.items[index].name = target.value;
      const newItems = [...poll.items];
      newItems[index].name = target.value;
      poll.items = newItems;
      updatePoll(poll);
    };
  }

  function onChangeItemValue(index: number) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const target = e.target;
      const newItems = [...poll.items];
      newItems[index].value = target.value;
      poll.items = newItems;
      updatePoll(poll);
    };
  }
  function onChangeItemChecked(index: number) {
    return function (e: ChangeEvent<HTMLInputElement>) {
      const target = e.target;
      (poll as Poll<'checkbox'>).items[index].checked = target.checked;
      updatePoll(poll);
    };
  }

  function handleAddItem() {
    const newItems = [...poll.items];
    newItems.push({
      name: '',
      value: '',
      checked: false,
    });
    poll.items = newItems;
    updatePoll(poll);
  }

  function handleDeleteItem(index: number) {
    return function () {
      openInteractiveModal(Message.Single.Remove, () => {
        poll.items = poll.items.filter((item, i) => index !== i);
        updatePoll(poll);
      });
    };
  }

  useEffect(() => {
    function addErrors(pollId: string, itemIndex: number, cause: string) {
      setErrors((errors) => ({
        ...errors,
        [pollId]: { itemIndex, cause },
      }));
    }

    function deleteErrors(pollId: string) {
      setErrors((errors) => {
        delete errors[pollId];
        return { ...errors };
      });
    }

    if (poll.type === 'option') {
      const values = poll.items.map((item) => item.value);
      let index = -1;
      for (let i = 0; i < values.length; i++) {
        for (let q = i + 1; q < values.length; q++) {
          const first = values[i];
          const second = values[q];

          if (first === second) {
            index = i;
            break;
          }
        }
      }
      if (index === -1) {
        deleteErrors(poll.id);
      } else {
        addErrors(poll.id, index, 'duplicate');
      }
    }
  }, [poll.id, poll.items, poll.type, setErrors]);

  return (
    <Paper component={Stack} gap={2} p={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap={2}
        alignItems={{ xs: 'auto', d: 'flex-end' }}
      >
        <Typography whiteSpace="nowrap" fontSize={20} lineHeight={1.7}>
          질문 {index}.
        </Typography>
        <TextField
          name="label"
          size="small"
          placeholder="예시) 가장 선호하는 언어는 무엇인가요?"
          variant="filled"
          value={poll.label || ''}
          required
          fullWidth
          onChange={onChange}
          sx={{
            ['& input']: {
              pt: 1,
            },
          }}
        />
        <Stack position="relative">
          <Typography
            position="absolute"
            fontSize={14}
            bottom={'50%'}
            color="textDisabled"
            sx={{
              zIndex: 2,
              ml: 0.5,
              px: 0.2,
              backgroundColor: '#ffffff',
              transform: 'translateY(-50%)',
            }}
          >
            유형
          </Typography>
          <Select
            name="type"
            size="small"
            variant="outlined"
            value={poll.type || 'text'}
            onChange={onSelectChange}
            sx={{
              ['& legend']: {
                color: 'black',
              },
              ['& .MuiSelect-select']: { p: 0.7 },
              // ['&::before']: {
              //   borderBottom: 'none !important',
              // },
              // ['&:hover::before']: {
              //   borderBottom: 'none !important',
              // },
              // ['&::after']: {
              //   borderBottom: 'none !important',
              // },
              // ['&:hover::after']: {
              //   borderBottom: 'none !important',
              // },
            }}
          >
            <MenuItem value="text">직접입력</MenuItem>
            <MenuItem value="option">선택항목</MenuItem>
            <MenuItem value="checkbox">체크박스</MenuItem>
          </Select>
        </Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography component="label" whiteSpace="nowrap">
            <Switch
              id="required"
              name="required"
              size="medium"
              checked={poll.required || false}
              onChange={onChange}
            />
            필수여부
          </Typography>
          <IconButton onClick={() => handleDeletePoll(poll.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Stack>
        <Typography fontSize={14} gutterBottom color="textDisabled">
          설명
        </Typography>
        <PollDesc pollDesc={poll.desc} onChange={onChange} />
      </Stack>
      <Stack direction="row" justifyContent="space-between" gap={3}>
        <Stack direction="row" gap={2} flex={1}>
          <Stack flex={1}>
            <Typography fontSize={14} gutterBottom color="textDisabled">
              분류
            </Typography>
            <TextField
              name="name"
              size="small"
              placeholder="예시) language"
              required
              variant="filled"
              value={poll.name || ''}
              onChange={onChange}
              fullWidth
              sx={{
                ['& input']: {
                  pt: 1,
                },
              }}
            />
          </Stack>
        </Stack>
      </Stack>

      <Divider orientation="horizontal" flexItem />

      {poll.type === 'text' && (
        <Stack direction="row" gap={2}>
          <Stack flex={1}>
            <Typography fontSize={14} gutterBottom color="textDisabled">
              도움말
            </Typography>
            <TextField
              name="placeholder"
              size="small"
              variant="filled"
              value={poll.placeholder}
              onChange={onChange}
              fullWidth
              placeholder="해당 입력 창에 나타나는 도움말입니다."
              sx={{
                ['& input']: {
                  pt: 1,
                },
              }}
            />
          </Stack>
        </Stack>
      )}
      {poll.type === 'option' && (
        <Stack gap={2}>
          {(poll as Poll<'option'>).items.map((item, i) => (
            <Stack
              key={poll.id + '|' + i}
              direction="row"
              gap={2}
              alignItems="center"
            >
              <Typography fontSize={14} fontWeight={700}>
                {i + 1}
              </Typography>
              <TextField
                autoFocus
                placeholder="옵션명"
                size="small"
                value={item.name}
                name="name"
                onChange={onChangeItemName(i)}
                required
                error={errors?.[poll.id]?.itemIndex === i}
              />
              <TextField
                placeholder="옵션값"
                size="small"
                value={item.value}
                name="value"
                onChange={onChangeItemValue(i)}
                required
                error={errors?.[poll.id]?.itemIndex === i}
              />
              <Button
                color="error"
                variant="outlined"
                sx={{ minWidth: 'auto', px: 1 }}
                onClick={handleDeleteItem(i)}
              >
                ❌
              </Button>
            </Stack>
          ))}
          <Stack direction="row" gap={1}>
            <Button
              color="info"
              variant="outlined"
              onClick={handleAddItem}
              startIcon="➕"
            >
              추가
            </Button>
          </Stack>
        </Stack>
      )}
      {poll.type === 'checkbox' && (
        <Stack gap={1}>
          {(poll as Poll<'checkbox'>).items.map((item, i) => (
            <Stack
              key={poll.id + '|' + i}
              direction="row"
              gap={1}
              alignItems="center"
            >
              <Typography fontSize={14} fontWeight={700}>
                {i + 1}
              </Typography>
              <TextField
                autoFocus
                placeholder="옵션명"
                size="small"
                value={item.name}
                onChange={onChangeItemName(i)}
                required
              />
              <Switch
                size="medium"
                checked={item.checked}
                onChange={onChangeItemChecked(i)}
              />
              <Button
                color="error"
                variant="outlined"
                sx={{ minWidth: 'auto', px: 1 }}
                onClick={handleDeleteItem(i)}
              >
                ❌
              </Button>
            </Stack>
          ))}
          <Stack direction="row" gap={1}>
            <Button
              color="info"
              variant="outlined"
              onClick={handleAddItem}
              startIcon="➕"
            >
              추가
            </Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
};

export default PollOptionItem;
