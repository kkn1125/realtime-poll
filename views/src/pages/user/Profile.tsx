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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  defaultProfile,
  DefaultProfile,
  guestDisallowPaths,
  userDisallowPaths,
} from '@common/variables';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '@/apis/logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenAtom } from '@/recoils/token.atom';
import { removeAccount } from '@/apis/removeAccount';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import { Message } from '@common/messages';
import { getImageDataUrl } from '@utils/getImageDataUrl';
import { uploadProfileImage } from '@/apis/uploadProfileImage';
import { makeBlobToImageUrl } from '@utils/makeBlobToImageUrl';
import { AxiosError } from 'axios';
import { verifyLogin } from '@/apis/verifyLogin';

interface ProfileProps {}
const Profile: React.FC<ProfileProps> = () => {
  const queryClient = useQueryClient();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { openModal, openInteractiveModal } = useModal();
  const [{ user }, setToken] = useRecoilState(tokenAtom);
  const [current, setCurrent] = useState<
    Partial<
      Omit<User, 'id' | 'userProfile' | 'password' | 'createdAt' | 'updatedAt'>
    >
  >({});
  const [image, setImage] = useState('');

  const clearToken = useCallback(() => {
    localStorage.setItem('logged_in', 'false');
    setToken({
      signed: false,
      user: undefined,
      token: undefined,
      expired: true,
    });
    if (location.pathname.match(guestDisallowPaths)) {
      navigate('/');
    }
  }, [navigate, setToken]);

  const verifyMutate = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyLogin,
    onSuccess(data, variables, context) {
      if (data.ok) {
        setToken({
          signed: true,
          user: data.user,
          token: data.token,
          expired: false,
        });
        if (location.pathname.match(userDisallowPaths)) {
          navigate('/');
        }
      }
    },
    onError(error: AxiosError, variables, context) {
      const loggedIn = localStorage.getItem('logged_in');
      if (loggedIn === 'true') {
        openModal(Message.Expired.Token);
      } else if (error.response?.status === 401) {
        openModal(Message.Expired.Token);
      }
      clearToken();
    },
  });

  const profileUploadMutate = useMutation({
    mutationKey: ['uploadProfile'],
    mutationFn: uploadProfileImage,
    onSuccess(data, variables, context) {
      openModal({ title: '안내', content: '프로필 변경되었습니다.' });
      verifyMutate.mutate();
    },
    onError(error: AxiosError<{ message?: any }>, variables, context) {
      if (!error.response) {
        openModal({ title: '안내', content: '서버에 문제가 발생했습니다.' });
        return;
      }

      if (error.response.status === 401) {
        clearToken();
      } else {
        openModal({
          title: '안내',
          content: error.response?.data?.message || '잘못된 접근입니다.',
        });
      }
    },
  });

  const logoutMutate = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess(data, variables, context) {
      if (data.ok) {
        localStorage.setItem('logged_in', 'false');
        window.location.pathname = '/';
      }
    },
  });

  const removeAccountMutate = useMutation({
    mutationKey: ['removeAccount'],
    mutationFn: removeAccount,
    onSuccess(data, variables, context) {
      localStorage.setItem('logged_in', 'false');
      window.location.pathname = '/';
    },
  });

  useEffect(() => {
    if (!user) return;
    if (!user.userProfile) return;
    const { url, revokeUrl } = makeBlobToImageUrl(user.userProfile);

    setImage(url);
    setCurrent({
      email: user.email,
      username: user.username,
    });

    return () => {
      revokeUrl();
    };
  }, [user]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setCurrent((current) => ({ ...current, [name]: value }));
  }, []);

  const handleLogout = useCallback((e: MouseEvent) => {
    logoutMutate.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      openInteractiveModal(Message.Single.Save, () => {
        console.log(current);
      });
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current],
  );

  const handleRemoveAccount = useCallback((id?: string) => {
    if (id) {
      removeAccountMutate.mutate(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      setUploadFile(file);
      e.target.value = '';
      const { url } = getImageDataUrl(file, file.type);
      setImage(url);
    }
  }

  const handleSubmitUploadProfile = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (uploadFile) {
        profileUploadMutate.mutate(uploadFile);
        // uploadProfileImage(uploadFile);
      } else {
        openModal({ title: '안내', content: '변경 사항이 없습니다.' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadFile],
  );

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
        <Stack
          component="form"
          alignItems="center"
          gap={3}
          onSubmit={handleSubmitUploadProfile}
        >
          <Typography fontSize={32} fontWeight={700} gutterBottom>
            [{user?.username}] 님의 프로필
          </Typography>
          <Stack gap={4}>
            <Stack
              sx={{
                // background: 'black',
                borderRadius: '100%',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '5px 5px 1rem 0 #55555556',
                // (theme) => image ? theme.palette.text.disabled : undefined,
              }}
            >
              <Stack component="label">
                {image ? (
                  <Box
                    component="img"
                    width={300}
                    height={300}
                    src={image}
                    alt="profileImage"
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      cursor: 'pointer',
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={defaultProfile}
                    width={300}
                    height={300}
                    alt="default_profile"
                    sx={{ cursor: 'pointer' }}
                  />
                )}
                <input
                  hidden
                  type="file"
                  name="profile"
                  accept=".png,.webp,.avif,.jpeg,.jpg"
                  onChange={handleUploadFile}
                />
              </Stack>
            </Stack>
            <Button size="large" variant="contained" type="submit">
              변경
            </Button>
          </Stack>
        </Stack>
        <Divider flexItem />
        <Container maxWidth="sm">
          <Stack component="form" gap={2} onSubmit={handleSubmit}>
            <Stack>
              <Typography>Email</Typography>
              <CustomInput
                fullWidth
                size="small"
                name="email"
                type="email"
                autoComplete="new-username"
                value={current.email || ''}
                disabled
                // onChange={onChange}
              />
            </Stack>
            <Stack>
              <Typography>Username</Typography>
              <CustomInput
                fullWidth
                size="small"
                name="username"
                type="text"
                autoComplete="new-username"
                value={current.username || ''}
                onChange={onChange}
              />
            </Stack>

            {/* <Stack>
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
            </Stack> */}
            <Button type="submit" variant="contained" size="large">
              정보 수정
            </Button>
            <Divider />
            <Button
              color="error"
              variant="outlined"
              size="large"
              onClick={() => {
                openInteractiveModal(Message.Single.LeaveAlert, () => {
                  handleRemoveAccount(user?.id);
                });
              }}
            >
              회원탈퇴
            </Button>
          </Stack>
        </Container>
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default Profile;
