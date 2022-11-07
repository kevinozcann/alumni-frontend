import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import loadable from '@loadable/component';
import { Helmet } from 'react-helmet-async';

import useSettings from 'hooks/useSettings';
import { i18nActions, i18nLangSelector, i18nLanguagesSelector } from 'store/i18n';
import { userActions, userActiveSchoolSelector } from 'store/user';
import { TLang } from 'utils/shared-types';
import gtm from 'utils/gtm';

import AuthSchoost from './AuthSchoost';
import Languages from './Languages';

const Legal = loadable(() => import('layout/Legal'));
const CookiesNotification = loadable(() => import('components/CookiesNotification'));
const schoostTitle = 'Schoost by SmartClass: School Operating System';

const AuthPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const desktopDevice = useMediaQuery(theme.breakpoints.up('sm'));
  const [title, setTitle] = React.useState<string>(schoostTitle);

  // Selectors
  const lang = useSelector(i18nLangSelector);
  const activeSchool = useSelector(userActiveSchoolSelector);
  const languages = useSelector(i18nLanguagesSelector);

  const handleChangeLanguage = (language: TLang): void => {
    dispatch(i18nActions.setLanguage(language));

    setTimeout(() => {
      window?.location.reload();
    }, 100);
  };

  React.useEffect(() => {
    if (activeSchool) {
      setTitle(`${activeSchool.title} - ${schoostTitle}`);
    }
  }, [activeSchool]);

  React.useEffect(() => {
    dispatch(userActions.pullConfigurationSchool());
  }, []);

  React.useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang: lang }}>
        <title>{title}</title>
        <link rel='icon' type='image/png' href={activeSchool?.config?.favicon} sizes='16x16' />
      </Helmet>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={activeSchool ? false : true}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%'
        }}
      >
        <Container sx={{ height: '100%' }} maxWidth={settings.compact ? 'xl' : false}>
          <Box
            sx={{
              minHeight: '100vh',
              margin: 0
            }}
          >
            <Box
              sx={{
                backgroundColor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                mx: -3
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 1'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: '1 0 auto'
                  }}
                >
                  {desktopDevice && <AuthSchoost activeSchool={activeSchool} />}

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: '1 1 auto',
                      minWidth: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      p: 3
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flex: 'none',
                        justifyContent: 'flex-end',
                        mt: 2
                      }}
                    >
                      <Typography variant='subtitle2' color='textSecondary' sx={{ mx: 1 }}>
                        {/* No account yet? */}
                      </Typography>
                      <Link to='/auth/registration'>
                        {/* <Typography variant='subtitle2'>Sign Up!</Typography> */}
                      </Link>
                    </Box>

                    <Container maxWidth='sm' sx={{ height: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%'
                        }}
                      >
                        <Outlet />
                      </Box>
                    </Container>

                    <Languages
                      lang={lang}
                      languages={languages}
                      desktopDevice={desktopDevice}
                      handleChangeLanguage={handleChangeLanguage}
                    />

                    {!desktopDevice && (
                      <Legal
                        color='contrast'
                        sx={{
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%'
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>

        <CookiesNotification />
      </Box>
    </React.Fragment>
  );
};

export default AuthPage;
