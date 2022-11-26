import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import esLocale from 'date-fns/locale/es';
import trLocale from 'date-fns/locale/tr';
import React from 'react';
import { useClearCacheCtx } from 'react-clear-cache';
import { Helmet } from 'react-helmet-async';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';

import RTL from 'components/RTL';
import SplashScreen from 'components/SplashScreen';
import UpdateVersion from 'components/UpdateVersion';
import { FileManagerProvider } from 'contexts/FMModalContext';
import { SnackbarProvider } from 'contexts/SnackbarContext';
import useScrollReset from 'hooks/useScrollReset';
import useSettings from 'hooks/useSettings';
import GlobalStyles from 'layout/GlobalStyles';
import { authUserSelector } from 'store/auth';
import { i18nActions, i18nLangSelector } from 'store/i18n';
import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector } from 'store/user';
import { LocaleProvider } from 'theme/i18n/LocaleProvider';
import { createCustomTheme } from 'theme/index';
import gtm from 'utils/gtm';
import { TLang } from 'utils/shared-types';
import { gtmConfig } from './config';
import routes from './routes';
import { schoolSelector } from 'pages/organization/_store/school';

const localeMap = {
  ar: arLocale,
  en: enLocale,
  es: esLocale,
  tr: trLocale
};

const App = () => {
  const content = useRoutes(routes);
  const dispatch = useDispatch();
  const { isLatestVersion } = useClearCacheCtx();
  const { settings } = useSettings();

  // Selectors
  const user = useSelector(authUserSelector);
  const lang = useSelector(i18nLangSelector);
  const activeSchool = useSelector(schoolSelector);

  useScrollReset();

  React.useEffect(() => {
    if (activeSchool && !lang) {
      dispatch(i18nActions.setLanguage(activeSchool?.config?.language as TLang) || 'en');

      setTimeout(() => {
        window?.location.reload();
      }, 300);
    }
  }, [activeSchool]);

  // React.useEffect(() => {
  //   if (!activeSchool) {
  //     pullConfigurationSchool();
  //   }
  // }, []);

  React.useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  const theme = createCustomTheme(lang, {
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RTL direction={settings.direction}>
          <LocaleProvider lang={lang} activeSchool={activeSchool}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[lang] || enLocale}>
              <FileManagerProvider>
                <SnackbarProvider>
                  <Helmet
                    htmlAttributes={{ lang: lang || activeSchool?.config?.language || 'en' }}
                  />
                  <GlobalStyles />
                  {isLatestVersion ? (
                    user.accessToken ? (
                      content
                    ) : (
                      <SplashScreen />
                    )
                  ) : (
                    <UpdateVersion />
                  )}
                </SnackbarProvider>
              </FileManagerProvider>
            </LocalizationProvider>
          </LocaleProvider>
        </RTL>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
