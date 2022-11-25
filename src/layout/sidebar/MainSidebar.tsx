import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft,
  faBomb,
  faFileSearch,
  faSync
} from '@fortawesome/pro-duotone-svg-icons';

import 'utils/fontAwesome';

import Footer from 'layout/Footer';
import Scrollbar from 'layout/Scrollbar';
import { AppDispatch, RootState } from 'store/store';
import { authActions, authUserSelector } from 'store/auth';
import {
  userActions,
  userActiveMenuSelector,
  userActiveSchoolSelector,
  userActiveStudentSelector,
  userMenusSelector,
  userPhaseSelector
} from 'store/user';
import { i18nLangSelector } from 'store/i18n';
import useTranslation from 'hooks/useTranslation';
import { TLang } from 'utils/shared-types';
import StudentsPopover from 'components/StudentsPopover';
import { IFrequentMenu, IMenu } from 'pages/admin/menus/menu-types';
import { IStudent } from 'pages/students/_store/types';
import {
  parentStudentsActions,
  parentStudentsPhaseSelector,
  parentStudentsSelector
} from 'pages/students/parent/_store/students';
import { ISchool } from 'pages/organization/organization-types';
import { IUser } from 'pages/account/account-types';

import MainNavItem from './MainNavItem';
import ActiveMenuItems from './ActiveMenuItems';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  menus: userMenusSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeMenu: userActiveMenuSelector(state),
  userPhase: userPhaseSelector(state),
  parentStudents: parentStudentsSelector(state),
  parentStudentsPhase: parentStudentsPhaseSelector(state),
  activeStudent: userActiveStudentSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateUserMenus: (lang: TLang, user: IUser, school: ISchool) =>
    dispatch(userActions.updateUserMenus(lang, user, school)),
  updateActiveMenu: (menu: IMenu) => dispatch(userActions.updateActiveMenu(menu)),
  getParentStudents: (lang: TLang, userId: string, parentName: string) =>
    dispatch(parentStudentsActions.pullParentStudents(lang, userId, parentName)),
  updateActiveStudent: (student: IStudent) => dispatch(userActions.updateActiveStudent(student))
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MainSidebarProps = PropsFromRedux & {
  onMobileClose: () => void;
  openMobile: boolean;
};

const MainSidebar = (props: MainSidebarProps) => {
  const {
    lang,
    user,
    menus,
    activeSchool,
    activeMenu,
    parentStudents,
    parentStudentsPhase,
    activeStudent,
    userPhase,
    getParentStudents,
    updateUserMenus,
    updateActiveStudent,
    updateActiveMenu,
    onMobileClose,
    openMobile
  } = props;
  const location = useLocation();
  const intl = useTranslation();

  const handleMainMenuClick = React.useCallback((menu: IMenu) => {
    updateActiveMenu(menu);
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
    updateActiveMenu(null);
  };

  // Pull students for the parent
  React.useEffect(() => {
    if (user?.userType.id === 9 && parentStudents?.length === 0) {
      getParentStudents(lang, user.uuid, user.fullName);
    }
  }, [lang, user]);

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
      {user?.userType?.id === 9 && (
        <Box
          sx={{
            backgroundColor: 'background.default',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
          <StudentsPopover
            parentStudents={parentStudents}
            activeStudent={activeStudent}
            parentStudentsPhase={parentStudentsPhase}
            changeStudent={updateActiveStudent}
          />
          <Divider />
        </Box>
      )}

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
            {(activeSchool && (
              <>
                <FontAwesomeIcon icon={faBomb} size='lg' />
                <Typography variant='body1' sx={{ mt: 1 }}>
                  {intl.translate({ id: 'menus.not_loaded' })}
                </Typography>
                <Button onClick={() => updateUserMenus(lang, user, activeSchool)}>
                  {intl.translate({ id: 'app.try_again' })}
                </Button>
              </>
            )) || (
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
            )}
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

export default connector(MainSidebar);
