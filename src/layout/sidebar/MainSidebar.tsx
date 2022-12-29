import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import menus, { IMenu } from 'data/menu';
import useTranslation from 'hooks/useTranslation';
import Footer from 'layout/Footer';
import Scrollbar from 'layout/Scrollbar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { i18nLangSelector } from 'store/i18n';
import 'utils/fontAwesome';

type MainSidebarProps = {
  onMobileClose: () => void;
  openMobile: boolean;
};

const MainSidebar = (props: MainSidebarProps) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const intl = useTranslation();

  // Selectors
  const lang = useSelector(i18nLangSelector);

  const handleMenuClick = React.useCallback(
    (menu: IMenu) => {
      if (menu.url) {
        onMobileClose();
      }
    },
    [lang, location]
  );

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
        <Box
          sx={{
            display: 'flex',
            height: '100%'
          }}
        >
          <Box
            sx={{
              width: '272px',
              height: '100%',
              bgcolor: 'background.paper',
              marginLeft: 0,
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
                </ListSubheader>
              }
            >
              {menus?.map((menu: IMenu) => (
                <ListItemButton
                  component={RouterLink}
                  to={menu.url}
                  sx={{ px: 2, width: '100%' }}
                  onClick={() => handleMenuClick(menu)}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon
                      icon={[menu.iconPrefix, menu.icon]}
                      color='primary.main'
                      size='sm'
                    />
                  </ListItemIcon>
                  <ListItemText primary={intl.formatMessage({ id: menu.title })} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
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
