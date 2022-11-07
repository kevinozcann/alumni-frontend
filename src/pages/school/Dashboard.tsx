import React from 'react';
import loadable from '@loadable/component';
import { useIntl } from 'react-intl';
import { Box, Grid, Skeleton } from '@mui/material';
import { IUserType, TLoginType, TUserZone } from 'pages/account/account-types';
import { useSubheader } from 'contexts/SubheaderContext';
// import {
//   SchoolUsageChart,
//   EnrollmentChart,
//   EnrollmentOverview,
//   HelpDesk
// } from './widgets';
import Page from 'layout/Page';

const BasicStats = loadable(() => import('pages/school/widgets/BasicStats'));
const QuickLinks = loadable(() => import('pages/school/widgets/QuickLinks'));
const SchoolUsageChart = loadable(() => import('pages/school/widgets/SchoolUsageChart'));
const EnrollmentChart = loadable(() => import('pages/school/widgets/EnrollmentChart'));
const EnrollmentOverview = loadable(() => import('pages/school/widgets/EnrollmentOverview'));
const DailySchedule = loadable(() => import('pages/school/widgets/DailySchedule'));

type TDashboardProps = {
  userType: IUserType;
  loginType: TLoginType;
  userZone: TUserZone;
};

const Dashboard: React.FC<TDashboardProps> = (props) => {
  const { userZone, loginType } = props;
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
          <Grid item xs={12} md={6}>
            <QuickLinks fallback={<Skeleton variant='rectangular' width='100%' height='100%' />} />
          </Grid>

          {(loginType === 'admin' || userZone === 'headquarters') && (
            <Grid item xs={12} md={6}>
              <SchoolUsageChart
                fallback={<Skeleton variant='rectangular' width='100%' height='100%' />}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <EnrollmentChart
              fallback={<Skeleton variant='rectangular' width='100%' height='100%' />}
            />
          </Grid>

          <Grid item xs={12}>
            <DailySchedule
              fallback={<Skeleton variant='rectangular' width='100%' height='100%' />}
            />
          </Grid>

          <Grid item xs={12}>
            <EnrollmentOverview
              fallback={<Skeleton variant='rectangular' width='100%' height='100%' />}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* <HelpDesk className='card-stretch gutter-b' /> */}
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default Dashboard;
