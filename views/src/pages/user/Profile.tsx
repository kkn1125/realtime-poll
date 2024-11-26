import { getMe } from '@/apis/getMe';
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { DefaultProfile } from '@common/variables';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '@/apis/logout';
import { useLocation } from 'react-router-dom';

interface ProfileProps {}
const Profile: React.FC<ProfileProps> = () => {
  const [current, setCurrent] = useState<
    Partial<Omit<User, 'id' | 'userProfile' | 'createdAt' | 'updatedAt'>>
  >({});
  const [image, setImage] = useState('');
  const { data } = useQuery<User>({
    queryKey: ['getMe'],
    queryFn: getMe,
  });
  const logoutMutate = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
  });

  useEffect(() => {
    if (data) {
      const image = data.userProfile?.[0]?.image;
      if (image) {
        const file = new Blob([new Uint8Array(image.data)], {
          type: 'image/jpeg',
        });
        const dataImage = URL.createObjectURL(file);
        setImage(dataImage);
      }
      setCurrent({
        email: data.email,
        username: data.username,
        password: '*'.repeat(8),
      });
    }
  }, [data, data?.userProfile]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setCurrent((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleLogout(e: MouseEvent) {
    logoutMutate.mutate();
    window.location.pathname = '/';
  }

  function handleSubmit(e: FormEvent) {}

  return (
    <Container>
      <Toolbar />
      <Stack direction="row" justifyContent="flex-end">
        <Button
          startIcon={<ExitToAppIcon />}
          color="error"
          variant="outlined"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Stack>
      <Stack gap={3}>
        <Stack alignItems="center" gap={3}>
          <Typography fontSize={32} fontWeight={700} gutterBottom>
            [{data?.username}] 님의 프로필
          </Typography>
          <Stack gap={1}>
            <Stack
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: (theme) =>
                  image ? theme.palette.text.disabled : undefined,
              }}
            >
              {image ? (
                <Box
                  component="img"
                  width={300}
                  height={300}
                  src={image}
                  alt="profileImage"
                />
              ) : (
                <DefaultProfile width={300} height={300} />
              )}
            </Stack>
            <Button variant="contained">변경</Button>
          </Stack>
        </Stack>
        <Divider flexItem />
        <Container maxWidth="sm">
          <Stack component="form" gap={2} onSubmit={handleSubmit}>
            <Stack>
              <Typography>Username</Typography>
              <TextField
                fullWidth
                size="small"
                name="username"
                type="text"
                autoComplete="new-username"
                value={current.username || ''}
                onChange={onChange}
              />
            </Stack>
            <Stack>
              <Typography>Email</Typography>
              <TextField
                fullWidth
                size="small"
                name="email"
                type="email"
                autoComplete="new-username"
                value={current.email || ''}
                onChange={onChange}
              />
            </Stack>
            <Stack>
              <Typography>Password</Typography>
              <TextField
                fullWidth
                size="small"
                name="password"
                type="password"
                autoComplete="new-password"
                value={current.password || ''}
                onChange={onChange}
              />
            </Stack>
            <Button type="submit" variant="contained">
              정보 수정
            </Button>
          </Stack>
        </Container>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Profile;
