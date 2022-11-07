import React from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps } from 'react-redux';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-duotone-svg-icons';

import { RootState } from 'store/store';
import { authFrequentMenusSelector, authImpersonateSelector } from 'store/auth';
import { userActiveSchoolSelector } from 'store/user';

const ContentSearch = loadable(() => import('./search/ContentSearch'));
const LanguagePopover = loadable(() => import('./languages/LanguagePopover'));
const NotificationsPopover = loadable(() => import('./notifications/NotificationsPopover'));
const AccountPopover = loadable(() => import('./account/AccountPopover'));

const mapStateToProps = (state: RootState) => ({
  frequentMenus: authFrequentMenusSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  impersonateUser: authImpersonateSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TMainNavbarProps = PropsFromRedux & {
  onSidebarMobileOpen?: () => void;
};

const MainNavbar: React.FC<TMainNavbarProps> = (props) => {
  const { frequentMenus, activeSchool, impersonateUser, onSidebarMobileOpen } = props;
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

        {activeSchool && (
          <Typography sx={{ display: { xs: 'none', sm: 'block' } }} variant='h1'>
            {activeSchool.title}
          </Typography>
        )}

        <Box
          sx={{
            flexGrow: 1,
            ml: 2
          }}
        />
        <Box sx={{ ml: 1 }}>
          <ContentSearch frequentMenus={frequentMenus} />
        </Box>
        <Box sx={{ ml: 1 }}>
          <NotificationsPopover />
        </Box>
        <Box sx={{ ml: 1 }}>
          <LanguagePopover />
        </Box>
        <Box sx={{ ml: 2 }}>
          <AccountPopover impersonateUser={impersonateUser} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default connector(MainNavbar);
