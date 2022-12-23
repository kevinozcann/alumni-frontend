import { faArrowCircleLeft, faFileSearch, faSync } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import 'utils/fontAwesome';

import menus, { IMenu } from 'data/menu';
import useTranslation from 'hooks/useTranslation';
import Footer from 'layout/Footer';
import Scrollbar from 'layout/Scrollbar';
import { authUserSelector } from 'store/auth';
import { i18nLangSelector } from 'store/i18n';
import {
  userActions,
  userActiveMenuSelector,
  userActiveSchoolSelector,
  userPhaseSelector
} from 'store/user';
import ActiveMenuItems from './ActiveMenuItems';
import MainNavItem from './MainNavItem';

type MainSidebarProps = {
  onMobileClose: () => void;
  openMobile: boolean;
};

const MainSidebar = (props: MainSidebarProps) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const intl = useTranslation();
  const dispatch = useDispatch();

  // Selectors
  const user = useSelector(authUserSelector);
  const userPhase = useSelector(userPhaseSelector);
  const activeSchool = useSelector(userActiveSchoolSelector);
  const lang = useSelector(i18nLangSelector);
  const activeMenu = useSelector(userActiveMenuSelector);

  const handleMainMenuClick = React.useCallback((menu: IMenu) => {
    dispatch(userActions.updateActiveMenu(menu));
  }, []);

  const handleMenuClick = React.useCallback(
    (menu: IMenu) => {
      if ((!menu.children || (menu.children && menu.children.length === 0)) && menu.url) {
        onMobileClose();
      }
    },
    [lang, user, location]
  );

  const handleBackButtonClick = () => {
    dispatch(userActions.updateActiveMenu(null));
  };

  React.useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const menuContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        {(menus?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              width: '544px',
              height: '100%'
            }}
          >
            <>
              <Box
                sx={{
                  width: '272px',
                  height: '100%',
                  bgcolor: 'background.paper',
                  marginLeft: activeMenu ? '-272px' : 0,
                  transitionProperty: 'margin-left',
                  transitionDuration: '.2s'
                }}
              >
                <List
                  sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}
                  component='div'
                  subheader={
                    <ListSubheader component='div' disableSticky>
                      {intl.formatMessage({ id: 'menu.menus' })}
                      {userPhase?.includes('ing') && (
                        <FontAwesomeIcon icon={faSync} spin={true} style={{ margin: '0 4px' }} />
                      )}
                    </ListSubheader>
                  }
                >
                  {menus?.map((menu: IMenu) => (
                    <MainNavItem
                      key={menu.id}
                      menu={menu}
                      isActiveMenu={!!activeMenu}
                      handleClick={() => handleMainMenuClick(menu)}
                    />
                  ))}
                </List>
              </Box>

              <Box
                sx={{
                  width: '272px',
                  height: '100%',
                  bgcolor: 'background.paper'
                }}
              >
                <List>
                  <ListItemButton sx={{ px: 2 }} onClick={handleBackButtonClick}>
                    <ListItemIcon>
                      <Box sx={{ width: '16px' }}>
                        <FontAwesomeIcon icon={faArrowCircleLeft} color='primary.main' />
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={intl.formatMessage({ id: 'app.back' })} />
                  </ListItemButton>
                </List>
                <Divider />
                {activeMenu && (
                  <ActiveMenuItems activeMenu={activeMenu} handleMenuClick={handleMenuClick} />
                )}
              </Box>
            </>
          </Box>
        )) || (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: '48px',
              width: '100%'
            }}
          >
            {
              <>
                <FontAwesomeIcon icon={faFileSearch} size='lg' />
                <Typography variant='body1' sx={{ mt: 1 }}>
                  {intl.translate({ id: 'register.no_school' })}
                </Typography>
                <Typography variant='body1' sx={{ mt: 1, textAlign: 'center' }}>
                  {intl.translate({ id: 'register.create_or_join_school' })}
                </Typography>
                <Typography variant='body1' sx={{ mt: 1, textAlign: 'center' }}>
                  Coming Soon
                </Typography>

                {/* <Button onClick={() => updateUserMenus(lang, user, activeSchool)}>
                  {intl.translate({ id: 'app.try_again' })}
                </Button> */}
              </>
            }
          </Box>
        )}
      </Scrollbar>
      <Footer />
    </Box>
  );

  return (
    <>
      <Box sx={{ display: { lg: 'none', xs: 'block' } }}>
        <Drawer
          anchor='left'
          onClose={onMobileClose}
          open={openMobile}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              border: 'none',
              width: '280px',
              px: 1,
              overflow: 'hidden'
            }
          }}
          variant='temporary'
        >
          {menuContent}
        </Drawer>
      </Box>

      <Box sx={{ display: { lg: 'block', xs: 'none' } }}>
        <Drawer
          anchor='left'
          open
          PaperProps={{
            sx: {
              top: '64px !important',
              width: '280px',
              overflow: 'hidden',
              backgroundColor: 'background.paper',
              border: 'none',
              height: 'calc(100% - 64px) !important',
              px: 1
            }
          }}
          variant='persistent'
        >
          {menuContent}
        </Drawer>
      </Box>
    </>
  );
};

export default MainSidebar;
