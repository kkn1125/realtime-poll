import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { Poll } from '@utils/Poll';

const LegendText = styled((props) => <Typography {...props} />)``;

interface PollItemProps {
  poll: Poll<'text' | 'option' | 'checkbox'>;
  onChange: (id: string, value: string | boolean) => void;
  onChangeCheckbox: (id: string, index: number, checked: boolean) => void;
}
const PollItem: React.FC<PollItemProps> = ({
  poll,
  onChange,
  onChangeCheckbox,
}) => {
  switch (poll.type) {
    case 'text':
      return (
        <Stack gap={1}>
          <Typography fontSize={24} fontWeight={700}>
            {poll.label}
            {poll.required && '*'}
          </Typography>
          <FormControl
            required={poll.required}
            component="fieldset"
            variant="standard"
            sx={{ gap: 2 }}
          >
            <FormLabel
              component={LegendText}
              className="font-maru"
              sx={{
                color: 'CaptionText',
                fontWeight: 500,
              }}
            >
              {poll.desc}
            </FormLabel>
            <TextField
              required={poll.required}
              name={poll.name}
              placeholder={poll.placeholder}
              value={poll.value || poll.default || ''}
              onChange={(e) => onChange(poll.id, e.target.value)}
            />
          </FormControl>
        </Stack>
      );
    case 'option':
      return (
        <Stack gap={1}>
          <Typography fontSize={24} fontWeight={700}>
            {poll.label}
            {poll.required && '*'}
          </Typography>
          <FormControl
            required={poll.required}
            component="fieldset"
            variant="standard"
            sx={{ gap: 2 }}
          >
            {poll.desc && (
              <FormLabel
                component={LegendText}
                className="font-maru"
                sx={{ color: 'CaptionText', fontWeight: 500 }}
              >
                {poll.desc}
              </FormLabel>
            )}

            <Select
              value={poll.value || poll.default || poll.items[0].value}
              required={poll.required}
              onChange={(e) => onChange(poll.id, e.target.value)}
            >
              {(poll as Poll<'option'>).items.map((item) => (
                <MenuItem key={item.name} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {poll.value === 'etc' && <TextField name="etc" value={poll.etc} />}
          </FormControl>
        </Stack>
      );
    case 'checkbox':
      return (
        <Stack gap={1}>
          <Typography fontSize={24} fontWeight={700}>
            {poll.label}
            {poll.required && '*'}
          </Typography>

          <Stack direction="row" gap={1}>
            <FormControl
              required={poll.required}
              component="fieldset"
              variant="standard"
              sx={{ gap: 2 }}
            >
              {poll.desc && (
                <FormLabel
                  component={LegendText}
                  className="font-maru"
                  sx={{ color: 'CaptionText', fontWeight: 500 }}
                >
                  {poll.desc}
                </FormLabel>
              )}
              <FormGroup>
                {(poll as Poll<'checkbox'>).items.map((item, i) => (
                  <FormControlLabel
                    key={item.name + i}
                    label={item.name}
                    control={
                      <Checkbox
                        name={item.name}
                        checked={
                          item.checked ||
                          (poll as Poll<'checkbox'>).default ||
                          false
                        }
                        onChange={(e) =>
                          onChangeCheckbox(poll.id, i, e.target.checked)
                        }
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Stack>
        </Stack>
      );
    default:
      return <TextField />;
  }
};

export default PollItem;
