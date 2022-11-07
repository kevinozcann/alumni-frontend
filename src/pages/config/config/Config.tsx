import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Grid } from '@mui/material';
import { faUserGraduate, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';

import Page from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';

import ConfigCard from './ConfigCard';

export interface IConfigLink {
  id: number;
  title: string;
  description: string;
  url: string;
  icon: IconDefinition;
  admin?: boolean;
}
const configLinks: IConfigLink[] = [
  {
    id: 1,
    title: 'config.system',
    description: 'config.system.explanation',
    url: '/config/system',
    icon: faUserGraduate,
    admin: true
  },
  {
    id: 2,
    title: 'config.grades',
    description: 'config.grades.explanation',
    url: '/config/grade-levels',
    icon: faUserGraduate
  }
];

type TConfigProps = {
  title: string;
};

const Config: React.FC<TConfigProps> = () => {
  const intl = useIntl();
  const subheader = useSubheader();
  const [mode] = React.useState<string>('grid');

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'config', url: '/config' });
    breadcrumbs.push({ title: 'dashboard', url: '/config/dashboard' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'config' })}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Grid container spacing={3}>
          {configLinks.map((configLink: IConfigLink) => (
            <Grid
              item
              key={configLink.id}
              md={mode === 'grid' ? 4 : 12}
              sm={mode === 'grid' ? 6 : 12}
              xs={12}
            >
              <ConfigCard configLink={configLink} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Page>
  );
};

export default Config;
