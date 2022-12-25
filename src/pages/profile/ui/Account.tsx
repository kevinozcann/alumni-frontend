import { faEdit, faHome, faImage, faLock } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import loadable from '@loadable/component';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import { Amplify } from 'aws-amplify';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { useSubheader } from 'contexts/SubheaderContext';
import Page from 'layout/Page';
import { authUserSelector } from 'pages/auth/services/store/auth';
import StyledMenu from 'utils/StyledMenu';
import { userProfileSelector } from '../services/store/selectors';
import { userActions } from '../services/actions';

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

const Account = () => {
  const { section } = useParams();
  const intl = useIntl();
  const subheader = useSubheader();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activePage, setActivePage] = React.useState<string>(section);
  const [pageTitle, setPageTitle] = React.useState<string>(getPageTitle(section));
  const [anchorHomeMenuEl, setAnchorHomeMenuEl] = React.useState<HTMLElement>(null);

  // Selectors
  const authUser = useSelector(authUserSelector);
  const user = useSelector(userProfileSelector);

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

  React.useEffect(() => {
    if (!user) {
      dispatch(userActions.getUserProfile(authUser));
    }
  }, [user]);

  return (
    <Page title={intl.formatMessage({ id: 'account.myaccount' })}>
      <Grid container>
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs>
            <Card>
              {(user?.wallpaperUrl && (
                <CardMedia
                  width='100%'
                  height={300}
                  sx={{ height: 300 }}
                  component='img'
                  image={user?.wallpaperUrl}
                  title='user wallpaper'
                  alt='user wallpaper'
                />
              )) || (
                <Skeleton variant='rectangular' height={300} width='100%' sx={{ height: 300 }} />
              )}
              {(user && (
                <CardHeader
                  avatar={<Avatar alt='username' src={user.avatarUrl} />}
                  title={`${user?.name} ${user?.family_name}`}
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
              )) || <Skeleton variant='rectangular' height={80} width='100%' sx={{ height: 80 }} />}
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {(activePage === 'home' || activePage === 'post') && <AccountHome />}
            {activePage === 'update' && <General />}
            {activePage === 'photos' && <Images />}
            {activePage === 'security' && <ChangePassword showCurrentPassword={true} />}
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Account;
