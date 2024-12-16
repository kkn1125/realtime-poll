import { sidebarAtom } from '@/recoils/sidebar.atom';
import { BRAND_NAME, scrollSize } from '@common/variables';
import SnapBreadCrumbs from '@components/atoms/SnapBreadCrumbs';
import SeoMetaTag from '@components/moleculars/SeoMetaTag';
import Footer from '@components/organisms/Footer';
import Header from '@components/organisms/Header';
import Sidebar from '@components/organisms/Sidebar';
import { Box, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import Helmet from 'react-helmet';
import { Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const sidebarWidth = {
  min: 56,
  max: 250,
};

interface LayoutProps {
  isCrew?: boolean;
}
const Layout: React.FC<LayoutProps> = ({ isCrew = true }) => {
  const sidebarState = useRecoilValue(sidebarAtom);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpened = isMdDown ? !sidebarState.opened : sidebarState.opened;
  const locate = useLocation();

  const canonical = useMemo(() => {
    return location.origin + location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isMain = !isCrew && locate.pathname === '/';

  return (
    <Stack height="inherit">
      <SeoMetaTag
        canonical="https://snappoll.kro.kr"
        title={BRAND_NAME}
        author={BRAND_NAME}
        description="SnapPoll은 사용자들이 설문을 쉽게 만들고 참여할 수 있는 플랫폼입니다."
        url="https://snappoll.kro.kr"
        site_name="SnapPoll"
        keywords={[
          '설문',
          '투표',
          'SnapPoll',
          '온라인 설문',
          '간편한 설문',
          '설문 통계',
          '투표 통계',
          '무료 설문',
        ]}
        type="article"
        image="/favicon/apple-touch-icon.png"
      />
      {/* header */}
      <Header isCrew={isCrew} />
      <Toolbar />
      <Stack direction="row" flex={1} position="relative" overflow="hidden">
        {/* Sidebar */}
        {isCrew && (
          <Stack
            id="sidebar"
            overflow="hidden"
            sx={{
              width: '100%',
              maxWidth: sidebarOpened
                ? sidebarWidth.max
                : isMdDown
                  ? 0
                  : sidebarWidth.min,
              transition: '150ms ease-in-out',
              borderRight: '1px solid #eee',
              backgroundColor: '#fff',
              ...(isMdDown && {
                position: 'absolute',
                zIndex: 5,
                top: 0,
                left: 0,
                bottom: 0,
              }),
            }}
          >
            <Sidebar />
          </Stack>
        )}

        {/* main */}
        <Stack
          id="main"
          flex={1}
          overflow="auto"
          p={isMain ? 0 : 2}
          sx={{
            ['&::-webkit-scrollbar']: {
              width: scrollSize,
              height: scrollSize,
              boxShadow: 'inset 0 0 0 99px #eee',
              background: 'transparent',
            },
            ['&::-webkit-scrollbar-thumb']: {
              width: scrollSize,
              height: scrollSize,
              borderRadius: 0.5,
              backgroundColor: (theme) => theme.palette.sky.dark,
            },
          }}
        >
          {isCrew && <SnapBreadCrumbs />}
          {!isMain && <Box minHeight={20} maxHeight={20} />}
          <Outlet />
          <Toolbar />
        </Stack>
      </Stack>
      {/* footer */}
      <Footer />
    </Stack>
  );
};

export default Layout;
