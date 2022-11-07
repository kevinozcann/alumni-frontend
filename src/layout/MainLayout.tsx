import React from 'react';
import loadable from '@loadable/component';
import { Outlet, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useIdleTimer } from 'react-idle-timer';

import MainNavbar from './MainNavbar';
import ImpersonateBar from './ImpersonateBar';

const MainSidebar = loadable(() => import('./sidebar/MainSidebar'));
const SubNavbar = loadable(() => import('./SubNavbar'));

const IDLE_TIMEOUT =
  (process.env.REACT_APP_IDLE_TIMEOUT && parseInt(process.env.REACT_APP_IDLE_TIMEOUT)) ||
  1000 * 60 * 30; // 30 minutes

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%'
}));

const MainLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '280px'
  }
}));

const MainLayoutContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const MainLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch'
});

const MainLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();

  useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: () => navigate('/logout'),
    crossTab: {
      emitOnAllTabs: true
    },
    debounce: 500
  });

  return (
    <MainLayoutRoot>
      <MainNavbar onSidebarMobileOpen={(): void => setIsSidebarMobileOpen(true)} />
      <MainSidebar
        onMobileClose={(): void => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />
      <MainLayoutWrapper>
        <MainLayoutContainer>
          <MainLayoutContent>
            <SubNavbar />
            <ImpersonateBar />
            <Outlet />
          </MainLayoutContent>
        </MainLayoutContainer>
      </MainLayoutWrapper>
    </MainLayoutRoot>
  );
};

export default MainLayout;
