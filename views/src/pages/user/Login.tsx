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

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  const { openModal } = useModal();
  const locate = useLocation();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState<
    Pick<LoginUser, 'email' | 'password'>
  >({
    email: '',
    password: '',
  });
  const { errors, validate, validated, setValidated } = useValidate(loginInfo);
  const setToken = useSetRecoilState(tokenAtom);
  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess(data, _variables, _context) {
      if (data.ok) {
        localStorage.setItem('logged_in', 'true');
        navigate('/');
      }
    },
    onError(error: AxiosError, _variables, _context) {
      const { response } = error;
      const { data } = response as { data: any };

      localStorage.setItem('logged_in', 'false');

      setLoginInfo((loginInfo) => ({
        email: loginInfo.email,
        password: '',
      }));
      openModal(Message.WrongRequest(data.message));
    },
  });

  useEffect(() => {
    window.history.replaceState({}, '');
    if (locate?.state?.type) {
      openModal({
        title: '권한 필요',
        content: '로그인이 필요한 기능입니다.',
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

      if (!validate()) return;

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
          variant="contained"
          size="large"
          to="/user/signup"
          color="sky"
        >
          계정이 없어요
        </Button>
        <Button
          component={Link}
          variant="contained"
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

export default Login;
