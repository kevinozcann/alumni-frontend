import React from 'react';
import loadable from '@loadable/component';
import { useIntl } from 'react-intl';
import { Box, Grid, Skeleton } from '@mui/material';
import { IUserType, TLoginType, TUserZone } from 'pages/auth/data/account-types';
import { useSubheader } from 'contexts/SubheaderContext';
// import {
//   SchoolUsageChart,
//   EnrollmentChart,
//   EnrollmentOverview,
//   HelpDesk
// } from './widgets';
import Page from 'layout/Page';

const BasicStats = loadable(() => import('pages/school/ui/components/BasicStats'));

const Dashboard = () => {
  const intl = useIntl();
  const subheader = useSubheader();

  React.useEffect(() => {
    const breadcrumbs = [
      { title: 'school.management.school.management', url: '/school' },
      { title: 'school.management.dashboard', url: '/school/dashboard' }
    ];
    subheader.setBreadcrumbs(breadcrumbs);
    // eslint-disable-next-line
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'school.management.dashboard' })}>
      <Box sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <BasicStats fallback={<Skeleton variant='rectangular' width='100%' height='100%' />} />
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default Dashboard;
