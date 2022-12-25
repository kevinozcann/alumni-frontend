import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl, FormattedNumber } from 'react-intl';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
// import Chart from 'react-apexcharts';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faChevronDown,
  faSackDollar,
  faUserGraduate,
  faUserPlus,
  faUsers
} from '@fortawesome/pro-duotone-svg-icons';

import { configCurrencySelector } from 'store/config';
import { i18nLangSelector } from 'store/i18n';
import { AppDispatch, RootState } from 'store/store';
import StatsBox from 'components/dashboard/StatsBox';
// import Resize from 'components/Resize';
import { TLang } from 'utils/shared-types';
import StyledMenu from 'utils/StyledMenu';

import {
  basicStatsSelector,
  basicStatsPhaseSelector,
  basicStatsActions
} from 'pages/school/_store/basicStats';
import {
  dailyCashStatsSelector,
  dailyCashStatsActions,
  dailyCashStatsPhaseSelector,
  actionPhases as dailyCashActionPhases
} from 'pages/school/_store/dailyCashStats';
import { fontFamily } from 'theme';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  basicStats: basicStatsSelector(state),
  basicStatsPhase: basicStatsPhaseSelector(state),
  dailyCashStats: dailyCashStatsSelector(state),
  dailyCashStatsPhase: dailyCashStatsPhaseSelector(state),
  currencyFormat: configCurrencySelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullBasicStats: (lang: TLang, schoolId: number) =>
    dispatch(basicStatsActions.pullBasicStats(lang, schoolId)),
  pullDailyCashStats: (lang: TLang, schoolId: number, period: string) =>
    dispatch(dailyCashStatsActions.pullDailyCashStats(lang, schoolId, period))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TBasicStatsProps = PropsFromRedux;

const BasicStats = (props: TBasicStatsProps) => {
  const {
    lang,
    basicStats,
    dailyCashStats,
    currencyFormat,
    dailyCashStatsPhase,
    pullBasicStats,
    pullDailyCashStats
  } = props;
  const { numberOfUsers, numberOfStudents, dailyCash, dailyEnrollments } = basicStats;
  const [open, setOpen] = React.useState<boolean>(false);
  const [chartData, setChartData] = React.useState<any>(null);
  const [dropdownKey, setDropdownKey] = React.useState<string>('week');
  const [dropdownTitle, setDropdownTitle] = React.useState<string>('');
  const [basicStatsMenuElt, setBasicStatsMenuElt] = React.useState<HTMLElement>(null);
  const intl = useIntl();
  const theme = useTheme();

  React.useEffect(() => {
    // Pull basic stats
    // pullBasicStats(lang, activeSchool.id);
  }, [lang]);

  React.useEffect(() => {
    // Pull daily cash stats
    // pullDailyCashStats(lang, activeSchool.id, dropdownKey);

    // Set title of the dropdown menu
    setDropdownTitle(
      dropdownKey === 'week'
        ? intl.formatMessage({ id: 'calendar.week' })
        : intl.formatMessage({ id: 'calendar.month' })
    );
  }, [lang, dropdownKey]);

  React.useEffect(() => {
    setChartData(dailyCashStats || null);
  }, [dailyCashStats]);

  return (
    <Card>
      <CardHeader
        sx={{ bgcolor: '#F64E60', color: 'primary.contrastText' }}
        title={
          <Typography variant='h5'>
            {intl.formatMessage({ id: 'dashboard.basic_stats' })}
          </Typography>
        }
        disableTypography={true}
        action={
          <Stack direction='row' sx={{ margin: '3px 8px' }}>
            {dailyCashStatsPhase?.endsWith('ing') && (
              <CircularProgress sx={{ mx: 1 }} color='inherit' size={20} />
            )}
            <Box>
              <Button
                id='basic-stats-button'
                aria-controls='basic-stats-menu'
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                sx={{
                  color: theme.palette.grey[300],
                  borderColor: theme.palette.grey[300],
                  '& svg': {
                    fontSize: '14px !important'
                  },
                  '&:hover': {
                    color: theme.palette.grey[100],
                    borderColor: theme.palette.grey[100]
                  }
                }}
                size='small'
                variant='outlined'
                color='secondary'
                disableElevation
                onClick={(event: React.MouseEvent<HTMLElement>) =>
                  setBasicStatsMenuElt(event.currentTarget)
                }
                endIcon={<FontAwesomeIcon icon={faChevronDown} />}
              >
                {dropdownTitle}
              </Button>
              <StyledMenu
                id='basic-stats-menu'
                keepMounted
                MenuListProps={{
                  'aria-labelledby': 'basic-stats-menu'
                }}
                anchorEl={basicStatsMenuElt}
                open={Boolean(basicStatsMenuElt)}
                onClose={() => setBasicStatsMenuElt(null)}
              >
                <MenuItem
                  onClick={() => {
                    setDropdownKey('week');
                    setBasicStatsMenuElt(null);
                  }}
                  disableRipple
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {intl.formatMessage({ id: 'calendar.week' })}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDropdownKey('month');
                    setBasicStatsMenuElt(null);
                  }}
                  disableRipple
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {intl.formatMessage({ id: 'calendar.month' })}
                </MenuItem>
              </StyledMenu>
            </Box>
          </Stack>
        }
      />

      <CardContent sx={{ p: 0, m: 0, paddingBottom: '0 !important', position: 'relative' }}>
        <Box sx={{ fontFamily: fontFamily, height: 200, bgcolor: '#F64E60' }}>
          {chartData && dailyCashStatsPhase === dailyCashActionPhases.PULLING_SUCCESSFUL && (
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={chartData}>
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='payment'
                  stackId='1'
                  stroke='#db3535'
                  fill='#db3535'
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>

        <Box sx={{ mt: -8, mb: 2, mx: 1 }}>
          <Grid container spacing={1} justifyContent='space-between' alignItems='flex-start'>
            <Grid item xs={12} md={6}>
              <StatsBox
                boxStyle='warning'
                title={intl.formatMessage({
                  id: 'student.number_of_students'
                })}
                icon={faUserGraduate}
                value={numberOfStudents ? numberOfStudents.total : <CircularProgress size={20} />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StatsBox
                boxStyle='primary'
                title={intl.formatMessage({
                  id: 'user.number_of_users'
                })}
                icon={faUsers}
                value={numberOfUsers ? numberOfUsers.total : <CircularProgress size={20} />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StatsBox
                boxStyle='info'
                title={intl.formatMessage({
                  id: 'payment.daily_cash'
                })}
                icon={faSackDollar}
                value={
                  (dailyCash && (
                    <Box sx={{ fontSize: '80%' }}>
                      <FormattedNumber value={dailyCash.total} format={currencyFormat} />
                    </Box>
                  )) || <CircularProgress size={20} />
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StatsBox
                boxStyle='success'
                title={intl.formatMessage({
                  id: 'enrollment.daily_enrollment'
                })}
                icon={faUserPlus}
                value={dailyEnrollments ? dailyEnrollments.total : <CircularProgress size={20} />}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default connector(BasicStats);
