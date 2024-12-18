import { login } from '@/apis/login';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
import {
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
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

// const loginProcess = [
//   {
//     name: 'email',
//     type: 'email',
//     autoComplete: 'current-username',
//     placeholder: 'Email',
//     required: true,
//     fullWidth: true,
//     value: '',
//   },
//   {
//     name: 'password',
//     type: 'password',
//     autoComplete: 'new-password',
//     placeholder: 'Password',
//     required: true,
//     fullWidth: true,
//     value: '',
//   },
// ] as Format[];

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
    <Container component={Stack} maxWidth="sm" gap={2}>
      <Toolbar />
      <Stack
        component="form"
        gap={2}
        onSubmit={handleSubmit}
        noValidate
        // onChange={onFormChange}
      >
        <Typography fontSize={32} fontWeight={700} align="center">
          로그인
        </Typography>
        <CustomInput
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
          label="Password"
          name="password"
          type="password"
          errors={memoErrors}
          value={loginInfo.password}
          autoComplete="current-password"
          onChange={onChange}
        />

        <Divider />
        <Button variant="contained" size="large" type="submit">
          로그인
        </Button>
        <Button
          component={Link}
          variant="outlined"
          size="large"
          to="/auth/signup"
          color="warning"
        >
          계정이 없어요
        </Button>
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
      <Toolbar />
    </Container>
  );
};

export default LoginPage;
