import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useClearCacheCtx } from 'react-clear-cache';
import arLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import esLocale from 'date-fns/locale/es';
import trLocale from 'date-fns/locale/tr';

import GlobalStyles from 'layout/GlobalStyles';
import { createCustomTheme } from 'theme/index';
import { LocaleProvider } from 'theme/i18n/LocaleProvider';
import { AppDispatch, RootState } from 'store/store';
import { userActions, userActiveSchoolSelector } from 'store/user';
import { i18nActions, i18nLangSelector } from 'store/i18n';
import useSettings from 'hooks/useSettings';
import useAuth from 'hooks/useAuth';

import useScrollReset from 'hooks/useScrollReset';
import { SnackbarProvider } from 'contexts/SnackbarContext';
import { FileManagerProvider } from 'contexts/FMModalContext';
import SplashScreen from 'components/SplashScreen';
import RTL from 'components/RTL';
import gtm from 'utils/gtm';
import { TLang } from 'utils/shared-types';
import routes from './routes';
import { gtmConfig } from './config';
import UpdateVersion from 'components/UpdateVersion';

const localeMap = {
  ar: arLocale,
  en: enLocale,
  es: esLocale,
  tr: trLocale
};

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  activeSchool: userActiveSchoolSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setLanguage: (lang: TLang) => dispatch(i18nActions.setLanguage(lang)),
  pullConfigurationSchool: () => dispatch(userActions.pullConfigurationSchool())
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAppProps = PropsFromRedux;

const App = (props: TAppProps) => {
  const { lang, activeSchool, setLanguage, pullConfigurationSchool } = props;
  const content = useRoutes(routes);
  const auth = useAuth();
  const { isLatestVersion } = useClearCacheCtx();
  const { settings } = useSettings();

  useScrollReset();

  React.useEffect(() => {
    if (activeSchool && !lang) {
      setLanguage((activeSchool?.config?.language as TLang) || 'en');

      setTimeout(() => {
        window?.location.reload();
      }, 300);
    }
  }, [activeSchool]);

  React.useEffect(() => {
    if (!activeSchool) {
      pullConfigurationSchool();
    }
  }, []);

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
                    auth.isInitialized ? (
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

export default connector(App);
