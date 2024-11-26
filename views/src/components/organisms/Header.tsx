import { sidebarAtom } from '@/recoils/sidebar.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { BRAND_NAME, DefaultProfile, logoImage } from '@common/variables';
import useScroll from '@hooks/useScroll';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import WidgetsIcon from '@mui/icons-material/Widgets';

const headerBgChangePoint = 100;

interface HeaderProps {
  isCrew: boolean;
}
const Header: React.FC<HeaderProps> = ({ isCrew }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('');
  const { current } = useScroll();
  const [sidebarState, setSidebarState] = useRecoilState(sidebarAtom);
  const { username, profile } = useRecoilValue(tokenAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const sidebarOpened = isMdDown ? !sidebarState.opened : sidebarState.opened;

  function handleToggleSidebar() {
    setSidebarState((sidebarState) => ({
      ...sidebarState,
      opened: !sidebarState.opened,
    }));
  }

  const headerShadowActivate = useMemo(() => {
    return current >= headerBgChangePoint;
  }, [current]);

  useEffect(() => {
    if (profile) {
      const blob = new Blob([new Uint8Array(profile.data)], {
        type: 'image/jpeg',
      });
      const url = URL.createObjectURL(blob);
      setProfileImage(url);
    }
  }, [profile, profile?.data]);

  function redirectTo(to: string) {
    return () => {
      navigate(to);
      handleClose();
    };
  }

  return (
    <AppBar
      position="absolute"
      color={headerShadowActivate ? 'sky' : 'inherit'}
      sx={{
        top: 0,
        transition:
          'background-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
        ...(!headerShadowActivate && {
          '--Paper-shadow': '0 0 0 0 #ffffffff !important',
        }),
        borderBottom: '1px solid #eee',
      }}
    >
      <Toolbar>
        <Stack direction="row" flex={1} justifyContent="space-between" px={2}>
          <Stack direction="row" gap={2}>
            {isCrew && (
              <IconButton
                onClick={handleToggleSidebar}
                color="primary"
                sx={{
                  ['& svg']: {
                    transition: '150ms ease-in-out',
                    transform: 'rotate(0)',
                  },
                  ['&:hover svg']: {
                    transform: 'rotate(-20deg)',
                  },
                }}
              >
                {sidebarOpened ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
              </IconButton>
            )}
            <Stack
              component={Link}
              to="/"
              direction="row"
              gap={1}
              alignItems="center"
              color="inherit"
              sx={{
                textDecoration: 'none',
              }}
            >
              <Box
                component="img"
                src={logoImage}
                alt="logo"
                width={32}
                height={32}
              />
              <Typography fontSize={24} fontWeight={700}>
                {BRAND_NAME}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row">
            {isMdDown ? (
              <Stack alignItems="center">
                <IconButton onClick={handleClick}>
                  <WidgetsIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {isCrew ? (
                    <Stack>
                      <MenuItem onClick={redirectTo('/about')}>About</MenuItem>
                      <MenuItem onClick={redirectTo('/polls')}>Polls</MenuItem>
                      <MenuItem onClick={redirectTo('/votes')}>Votes</MenuItem>
                      <MenuItem onClick={redirectTo('/user/profile')}>
                        {profileImage ? (
                          <Avatar
                            src={profileImage}
                            sx={{ width: 32, height: 32 }}
                            alt={username}
                          />
                        ) : (
                          <DefaultProfile width={32} height={32} />
                        )}
                        {username}
                      </MenuItem>
                    </Stack>
                  ) : (
                    <Stack>
                      <MenuItem onClick={redirectTo('/user/signup')}>
                        Signup
                      </MenuItem>
                    </Stack>
                  )}
                </Menu>
              </Stack>
            ) : isCrew ? (
              <>
                <Button
                  component={Link}
                  size="large"
                  color="inherit"
                  to="/about"
                >
                  About
                </Button>
                <Button
                  component={Link}
                  size="large"
                  color="inherit"
                  to="/polls"
                >
                  Polls
                </Button>
                <Button
                  component={Link}
                  size="large"
                  color="inherit"
                  to="/votes"
                >
                  Votes
                </Button>
                <Button
                  component={Link}
                  size="large"
                  color="inherit"
                  to="/user/profile"
                  startIcon={
                    profileImage ? (
                      <Avatar
                        src={profileImage}
                        sx={{ width: 32, height: 32 }}
                        alt={username}
                      />
                    ) : (
                      <DefaultProfile width={32} height={32} />
                    )
                  }
                >
                  {username}
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                size="large"
                color="inherit"
                to="/user/signup"
              >
                Signup
              </Button>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
