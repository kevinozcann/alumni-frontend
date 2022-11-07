import React from 'react';
import Iframe from 'react-iframe';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { Alert, Box, Typography } from '@mui/material';

import Page from 'layout/Page';
import useSettings from 'hooks/useSettings';
import { AppDispatch, RootState } from 'store/store';
import { authUserSelector } from 'store/auth';
import { userActiveSchoolSelector } from 'store/user';
import { i18nLangSelector } from 'store/i18n';
import { useSubheader } from 'contexts/SubheaderContext';
import { TLang } from 'utils/shared-types';

import { storeActions, storeDataSelector } from './_store/store';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  store: storeDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  getApiToken: (lang: TLang, schoolId: number) => dispatch(storeActions.getApiToken(lang, schoolId))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TStoreProps = PropsFromRedux;

const StoreAdmin = (props: TStoreProps) => {
  const { user, lang, activeSchool, store, getApiToken } = props;
  const { apiToken, storeUrl, phase, error } = store;
  const [srcUrl, setSrcUrl] = React.useState<string>();
  const { settings } = useSettings();
  const intl = useIntl();
  const subheader = useSubheader();

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'store.store', url: '/store' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  React.useEffect(() => {
    getApiToken(lang, activeSchool.id);
  }, [activeSchool]);

  React.useEffect(() => {
    if (storeUrl && apiToken) {
      let queryParams = `schoost_username=${user.uuid}&schoost_firstname=${user.name}&schoost_lastname=${user.lastName}`;
      queryParams = `${queryParams}&schoost_email=${user.email}&schoost_image=${user.picture}`;
      queryParams = `${queryParams}&encrypt_key=${crypto.getRandomValues(new Uint8Array(20))}`;
      queryParams = `${queryParams}&schoost_key=${apiToken}`;

      setSrcUrl(`${storeUrl}/schst/index.php?route=common/login&${queryParams}`);
    }
  }, [storeUrl, apiToken]);

  return (
    <Page title={intl.formatMessage({ id: 'store.store' })}>
      <Box
        sx={{
          display: 'flex',
          height: `calc(100vh - ${settings.mainHeightGutter}px)`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {(phase === 'success' && srcUrl && (
          <Iframe
            url={srcUrl}
            width='100%'
            height='100%'
            id='opencart'
            name='opencart'
            display='inline'
            position='relative'
            loading='lazy'
            frameBorder={0}
          />
        )) ||
          (error && (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Alert severity='error'>{error.title}</Alert>
              {error.key === 'no_store_config' && (
                <Box sx={{ my: 1 }}>
                  <Alert severity='info'>
                    {intl.formatMessage({ id: 'store.buy_store_module' })}
                  </Alert>
                </Box>
              )}
            </Box>
          )) || (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography>{intl.formatMessage({ id: 'app.loading' })}</Typography>
            </Box>
          )}
      </Box>
    </Page>
  );
};

export default connector(StoreAdmin);
