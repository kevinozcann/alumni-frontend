import { Amplify, Storage } from 'aws-amplify';
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
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { useSubheader } from 'contexts/SubheaderContext';
import Page from 'layout/Page';
import { authUserSelector } from 'store/auth';
import { userActiveSchoolSelector, userSchoolsSelector } from 'store/user';
import { toAbsoluteUrl } from 'utils/AssetsHelpers';
import StyledMenu from 'utils/StyledMenu';
import { getS3File } from 'utils/amplifyUtils';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

const AccountHome = loadable(() => import('./AccountHome'));
const General = loadable(() => import('./edit/General'));
const Images = loadable(() => import('./edit/Images'));

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
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activePage, setActivePage] = React.useState<string>(section);
  const [pageTitle, setPageTitle] = React.useState<string>(getPageTitle(section));
  const [profileImg, setProfileImg] = React.useState<string>('');
  const [anchorHomeMenuEl, setAnchorHomeMenuEl] = React.useState<HTMLElement>(null);
  const [showWallpaper, setShowWallpaper] = React.useState<boolean>(false);

  // Selectors
  const user = useSelector(authUserSelector);
  const activeSchool = useSelector(userActiveSchoolSelector);
  // const error = useSelector(authErrorSelector);
  // const lang = useSelector(i18nLangSelector);
  // const phase = useSelector(authPhaseSelector);
  const schools = useSelector(userSchoolsSelector);

  const userAttributes = user.attributes;
  const wallpaper = userAttributes['custom:wallpaper'] || toAbsoluteUrl('/media/users/cover.jpeg');

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
    const setPicture = async () => {
      const picture = await getS3File(userAttributes['custom:picture']);

      setProfileImg(picture);
    };

    setPicture();
  }, [userAttributes]);

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
                title={`${userAttributes?.name} ${userAttributes?.family_name}`}
                subheader={userAttributes?.email}
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
            {activePage === 'update' && <General />}
            {activePage === 'photos' && <Images />}
            {/* {activePage === 'security' && (
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
            )} */}
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Account;
