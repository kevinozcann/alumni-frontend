import React from 'react';
import { useIntl } from 'react-intl';
import { Box } from '@mui/material';
import Iframe from 'react-iframe';

import Page from 'layout/Page';
import { apiBaseUrl } from 'store/ApiUrls';
import { useSubheader } from 'contexts/SubheaderContext';
import useSettings from 'hooks/useSettings';

const Endpoints = () => {
  const { settings } = useSettings();
  const intl = useIntl();
  const subheader = useSubheader();

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'developer', url: '/developer' });
    breadcrumbs.push({ title: 'developer.endpoints', url: '/developer/endpoints' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'developer.endpoints' })}>
      <Box
        sx={{
          display: 'flex',
          height: `calc(100vh - ${settings.mainHeightGutter}px)`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Iframe
          url={apiBaseUrl}
          width='100%'
          height='100%'
          id='smartclass'
          display='inline'
          position='relative'
          loading='lazy'
          frameBorder={0}
        />
      </Box>
    </Page>
  );
};

export default Endpoints;
