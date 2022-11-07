import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@mui/material';

import { backendBaseUrl, globalApiUrl } from 'store/ApiUrls';
import useSettings from 'hooks/useSettings';
import gtm from 'utils/gtm';
import Help from 'pages/help/Help';

interface IPageProps {
  title: string;
  children: React.ReactNode;
}

export const Page = (props: IPageProps) => {
  const { title } = props;
  const { settings } = useSettings();

  React.useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>{`${title} > Alumnist by SmartClass`}</title>
        <link rel='preconnect' href={`${globalApiUrl}`} />
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: `calc(100vh - ${settings.mainHeightGutter - 24}px)`,
          pb: 3
        }}
      >
        <Container sx={{ height: '100%' }} maxWidth={settings.compact ? 'xl' : false}>
          <Box
            sx={{
              minHeight: `calc(100vh - ${settings.mainHeightGutter}px)`,
              margin: 0
            }}
          >
            {props.children}
            <Help />
          </Box>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default Page;
