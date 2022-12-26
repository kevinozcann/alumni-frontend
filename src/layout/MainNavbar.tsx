import { faBars } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import loadable from '@loadable/component';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

const ContentSearch = loadable(() => import('./search/ContentSearch'));
const LanguagePopover = loadable(() => import('./languages/LanguagePopover'));
const NotificationsPopover = loadable(() => import('./notifications/NotificationsPopover'));
const AccountPopover = loadable(() => import('./account/AccountPopover'));

type TMainNavbarProps = {
  onSidebarMobileOpen?: () => void;
};

const MainNavbar = (props: TMainNavbarProps) => {
  const { onSidebarMobileOpen } = props;
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.primary.main
            : theme.palette.background.paper,
        color:
          theme.palette.mode === 'light'
            ? theme.palette.primary.contrastText
            : theme.palette.secondary.contrastText,
        borderBottom: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
        boxShadow: 'none',
        zIndex: theme.zIndex.drawer - 1
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          sx={{ display: { xs: 'block', lg: 'none' } }}
          aria-label='menu'
          color='inherit'
          disableRipple
          onClick={onSidebarMobileOpen}
          size='large'
        >
          <FontAwesomeIcon icon={faBars} />
        </IconButton>

        <Box
          sx={{
            flexGrow: 1,
            ml: 2
          }}
        />
        <Box sx={{ ml: 1 }}>
          <ContentSearch />
        </Box>
        <Box sx={{ ml: 1 }}>
          <NotificationsPopover />
        </Box>
        <Box sx={{ ml: 1 }}>
          <LanguagePopover />
        </Box>
        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavbar;
