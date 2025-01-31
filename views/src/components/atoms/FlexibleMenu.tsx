import { sidebarAtom } from '@/recoils/sidebar.atom';
import {
  Badge,
  Fade,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

interface FlexibleMenuProps {
  name: string;
  desc?: string;
  to: string;
  badge?: number;
  icon?: React.ReactNode;
}
const FlexibleMenu: React.FC<FlexibleMenuProps> = ({
  name,
  desc,
  to,
  badge,
  icon,
}) => {
  const navigation = useNavigate();
  const [sidebarState, setSidebarState] = useRecoilState(sidebarAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const opened = isMdDown ? !sidebarState.opened : sidebarState.opened;
  const locate = useLocation();

  const highlight = useMemo(() => {
    const paths = to.split('/').filter(($) => $).slice(0,2);
    const current = '/' + paths.join('/');

    return locate.pathname.startsWith(current);
  }, [locate.pathname, to]);

  function handleRedirect(to: string) {
    if (isMdDown) {
      handleCloseSidebar();
    }
    navigation(to);
  }

  const handleCloseSidebar = useCallback(() => {
    setSidebarState((sidebarState) => ({
      ...sidebarState,
      opened: !sidebarState.opened,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListItem
      disablePadding
      sx={{
        background: highlight ? '#cccccc56' : 'auto',
      }}
    >
      <Tooltip
        title={name}
        placement="right"
        arrow
        disableFocusListener={opened}
        disableHoverListener={opened}
        disableTouchListener={opened}
      >
        <ListItemButton onClick={() => handleRedirect(to)}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            {icon}
            <Fade in={!!badge && !opened}>
              <Badge badgeContent={badge} color="secondary" />
            </Fade>
          </ListItemIcon>
          <Fade in={opened}>
            <ListItemText
              primary={name}
              secondary={desc}
              sx={{ pl: 3, whiteSpace: 'nowrap' }}
            />
          </Fade>
          {!!badge && opened && (
            <Badge badgeContent={badge} color="secondary" />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

export default memo(FlexibleMenu);
