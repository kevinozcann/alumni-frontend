import React from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEdit, faImage, faLock } from '@fortawesome/pro-duotone-svg-icons';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Page from 'layout/Page';
import { AppDispatch, RootState } from 'store/store';
import {
  authUserSelector,
  authActions,
  authPhaseSelector,
  authErrorSelector,
  TUserPassword
} from 'store/auth';
import { userActiveSchoolSelector, userSchoolsSelector } from 'store/user';
import { i18nLangSelector } from 'store/i18n';
import { useSubheader } from 'contexts/SubheaderContext';
import StyledMenu from 'utils/StyledMenu';
import { TLang } from 'utils/shared-types';
import { toAbsoluteUrl } from 'utils/AssetsHelpers';

import { IUser } from './account-types';

const AccountHome = loadable(() => import('./AccountHome'));
const General = loadable(() => import('./edit/General'));
const Images = loadable(() => import('./edit/Images'));
const ChangePassword = loadable(() => import('./edit/ChangePassword'));

const getPageTitle = (page: string) =>
  page === 'update'
    ? 'account.myaccount'
    : page === 'photos'
    ? 'account.photos'
    : page === 'change-password'
    ? 'account.security'
    : 'account.home';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  error: authErrorSelector(state),
  lang: i18nLangSelector(state),
  phase: authPhaseSelector(state),
  schools: userSchoolsSelector(state),
  user: authUserSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  changeUserPassword: (lang: TLang, userId: string, email: string, user: TUserPassword) =>
    dispatch(authActions.changeUserPassword(lang, userId, email, user)),
  updateUserInfo: (userId: string, user: IUser) =>
    dispatch(authActions.updateUserInfo(userId, user))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAccountProps = PropsFromRedux;

const Account = (props: TAccountProps) => {
  const { lang, user, schools, activeSchool, phase, error, updateUserInfo, changeUserPassword } =
    props;
  const { section } = useParams();
  const [activePage, setActivePage] = React.useState<string>(section);
  const [pageTitle, setPageTitle] = React.useState<string>(getPageTitle(section));
  const [anchorHomeMenuEl, setAnchorHomeMenuEl] = React.useState<HTMLElement>(null);
  const [showWallpaper, setShowWallpaper] = React.useState<boolean>(false);
  const subheader = useSubheader();
  const intl = useIntl();
  const navigate = useNavigate();

  const wallpaper = user?.wallpaper || toAbsoluteUrl('/media/users/cover.jpeg');
  const profileImg = user?.picture || toAbsoluteUrl('/media/users/default.jpg');

  const handleHomeMenuElClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorHomeMenuEl(event.currentTarget);
  };
  const handleHomeMenuClose = () => {
    setAnchorHomeMenuEl(null);
  };

  const handlePageChange = (page: string) => {
    setAnchorHomeMenuEl(null);
    setActivePage(page);
    setPageTitle(getPageTitle(page));
    navigate(`/account/${page}`);
  };

  if (typeof activePage === 'undefined') {
    navigate('/account/home');
  }

  React.useLayoutEffect(() => {
    setTimeout(() => {
      setShowWallpaper(true);
    }, 500);
  }, []);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'account.myaccount', url: '/account' });
    if (pageTitle) {
      breadcrumbs.push({
        title: pageTitle,
        url: `/account/${activePage}`
      });
    }
    subheader.setBreadcrumbs(breadcrumbs);
  }, [activePage]);

  // Add service desk widget
  React.useEffect(() => {
    const jhdScriptElt = document.createElement('script');
    function jiraHelpdesk(jhdScript: HTMLScriptElement, callback: () => void) {
      jhdScript.type = 'text/javascript';
      jhdScript.setAttribute('data-jsd-embedded', null);
      jhdScript.setAttribute('data-key', '07f11a01-10d5-4205-9cb5-adbcfda822c0');
      jhdScript.setAttribute('data-base-url', 'https://jsd-widget.atlassian.com');
      jhdScript.src = 'https://jsd-widget.atlassian.com/assets/embed.js';
      jhdScript.onload = function () {
        callback();
      };

      document.getElementsByTagName('head')[0].appendChild(jhdScript);
    }

    if (user.userType.loginType === 'admin' || user.userType.loginType === 'manager') {
      jiraHelpdesk(jhdScriptElt, function () {
        const DOMContentLoaded_event = document.createEvent('Event');
        DOMContentLoaded_event.initEvent('DOMContentLoaded', true, true);
        window.document.dispatchEvent(DOMContentLoaded_event);
      });
    }
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'account.myaccount' })}>
      <Grid container>
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs>
            <Card>
              {(showWallpaper && (
                <CardMedia
                  width='100%'
                  height={300}
                  sx={{ height: 300 }}
                  component='img'
                  image={wallpaper}
                  title='user wallpaper'
                  alt='user wallpaper'
                />
              )) || (
                <Skeleton variant='rectangular' height={300} width='100%' sx={{ height: 300 }} />
              )}
              <CardHeader
                avatar={<Avatar alt='username' src={profileImg} />}
                title={user?.fullName}
                subheader={user?.email}
                action={
                  <React.Fragment>
                    <Box sx={{ mt: 1, display: { xs: 'none', md: 'block' } }}>
                      <React.Fragment>
                        <IconButton
                          component='button'
                          style={{ marginRight: 5 }}
                          onClick={() => handlePageChange('home')}
                          size='large'
                        >
                          <FontAwesomeIcon icon={faHome} size='xs' />
                        </IconButton>
                        <Button
                          color={activePage === 'update' ? 'primary' : 'inherit'}
                          onClick={() => handlePageChange('update')}
                        >
                          {intl.formatMessage({ id: 'account.update' })}
                        </Button>
                        <Button
                          color={activePage === 'photos' ? 'primary' : 'inherit'}
                          onClick={() => handlePageChange('photos')}
                        >
                          {intl.formatMessage({ id: 'account.photos' })}
                        </Button>
                        <Button
                          color={activePage === 'security' ? 'primary' : 'inherit'}
                          onClick={() => handlePageChange('security')}
                        >
                          {intl.formatMessage({ id: 'account.security' })}
                        </Button>
                      </React.Fragment>
                    </Box>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                      <React.Fragment>
                        <IconButton
                          aria-label='actions'
                          aria-haspopup='true'
                          onClick={handleHomeMenuElClick}
                          size='large'
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <StyledMenu
                          id='actions-menu'
                          keepMounted
                          MenuListProps={{
                            'aria-labelledby': 'actions-menu'
                          }}
                          anchorEl={anchorHomeMenuEl}
                          open={Boolean(anchorHomeMenuEl)}
                          onClose={handleHomeMenuClose}
                        >
                          <MenuItem onClick={() => handlePageChange('home')} disableRipple>
                            <FontAwesomeIcon icon={faHome} />
                            {intl.formatMessage({ id: 'account.home' })}
                          </MenuItem>
                          <MenuItem onClick={() => handlePageChange('update')} disableRipple>
                            <FontAwesomeIcon icon={faEdit} />
                            {intl.formatMessage({ id: 'account.myaccount' })}
                          </MenuItem>
                          <MenuItem onClick={() => handlePageChange('photos')} disableRipple>
                            <FontAwesomeIcon icon={faImage} />
                            {intl.formatMessage({ id: 'account.photos' })}
                          </MenuItem>
                          <MenuItem onClick={() => handlePageChange('security')} disableRipple>
                            <FontAwesomeIcon icon={faLock} />
                            {intl.formatMessage({ id: 'account.security' })}
                          </MenuItem>
                        </StyledMenu>
                      </React.Fragment>
                    </Box>
                  </React.Fragment>
                }
              />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {(activePage === 'home' || activePage === 'post') && (
              <AccountHome user={user} schools={schools} activeSchool={activeSchool} />
            )}
            {activePage === 'update' && (
              <General user={user} phase={phase} updateUserInfo={updateUserInfo} />
            )}
            {activePage === 'photos' && (
              <Images lang={lang} user={user} phase={phase} updateUserInfo={updateUserInfo} />
            )}
            {activePage === 'security' && (
              <ChangePassword
                title='account.security'
                description='account.security.description'
                showCurrentPassword={true}
                lang={lang}
                user={user}
                phase={phase}
                error={error}
                changeUserPassword={changeUserPassword}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default connector(Account);
