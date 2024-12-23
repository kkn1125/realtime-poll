import { tokenAtom } from '@/recoils/token.atom';
import { login } from '@apis/login';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

interface LoginPageProps {}
const LoginPage: React.FC<LoginPageProps> = () => {
  const setToken = useSetRecoilState(tokenAtom);
  const { openModal } = useModal();
  const locate = useLocation();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const { errors, validate, validated, setValidated } = useValidate(loginInfo);
  const mutation = useMutation<
    SnapResponseType<{ user: User; expiredTime: number }>,
    AxiosError<AxiosException>,
    LoginDto
  >({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess({ ok, data }, _variables, _context) {
      if (ok) {
        navigate('/');
        setToken({ user: data.user });
      }
    },
    onError(error: AxiosError<AxiosException>, _variables, _context) {
      setLoginInfo((loginInfo) => ({
        email: loginInfo.email,
        password: '',
      }));

      if (error.response) {
        const { data } = error.response;

        openModal({ info: Message.WrongRequest(data.errorCode.message) });
      }
    },
  });

  useEffect(() => {
    window.history.replaceState({}, '');
    if (locate?.state?.type) {
      openModal({
        info: {
          title: '권한 필요',
          content: '로그인이 필요한 기능입니다.',
        },
      });
    }
  }, [locate?.state?.type, openModal]);

  useEffect(() => {
    if (validated) {
      validate('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, loginInfo]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setValidated(true);

      if (!validate('login')) return;

      mutation.mutate(loginInfo);

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginInfo, mutation],
  );

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginInfo((loginInfo) => ({ ...loginInfo, [name]: value }));
  }, []);

  const memoErrors = useMemo(() => errors, [errors]);

  return (
    <Stack gap={2} flex={1} alignItems="center" justifyContent="center">
      <Stack
        component="form"
        gap={2}
        onSubmit={handleSubmit}
        noValidate
        width="50%"
        // onChange={onFormChange}
      >
        <Stack direction="row">
          <IconButton size="large" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography fontSize={32} fontWeight={700} align="center">
            로그인
          </Typography>
        </Stack>
        <CustomInput
          size="small"
          autoFocus
          label="Email"
          name="email"
          type="email"
          errors={memoErrors}
          value={loginInfo.email}
          autoComplete="username"
          onChange={onChange}
        />
        <CustomInput
          size="small"
          label="Password"
          name="password"
          type="password"
          errors={memoErrors}
          value={loginInfo.password}
          autoComplete="current-password"
          onChange={onChange}
        />

        <Button variant="contained" size="large" type="submit">
          로그인
        </Button>
        <Button component={Link} size="large" to="/auth/signup">
          스냅폴이 처음인가요?
        </Button>
        <Divider />
        <Typography
          component={Link}
          to="/auth/account"
          color="textSecondary"
          sx={{ textDecoration: 'none' }}
        >
          비밀번호를 잊으셨나요?
        </Typography>

        <Button
          component={Link}
          variant="outlined"
          size="large"
          to="/"
          color="inherit"
        >
          메인으로
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
