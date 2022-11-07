import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { schoolUsageStatsActions, schoolUsageStatsSelector } from '../_store/schoolUsageStats';
import { i18nLangSelector } from '../../../store/i18n';
import { AppDispatch, RootState } from '../../../store/store';
import { TLang } from '../../../utils/shared-types';
import { fontFamily } from '../../../theme';
import Widget from '../../../components/dashboard/Widget';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  schoolUsageStats: schoolUsageStatsSelector(state)
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullSchoolUsageStats: (lang: TLang) =>
    dispatch(schoolUsageStatsActions.pullSchoolUsageStats(lang))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TSchoolUsageChartProps = PropsFromRedux;

const SchoolUsageChart: React.FC<TSchoolUsageChartProps> = (props) => {
  const { lang, schoolUsageStats, pullSchoolUsageStats } = props;
  const [chartData, setChartData] = React.useState<any[]>(null);
  const intl = useIntl();
  const theme = useTheme();

  React.useEffect(() => {
    // Pull school usage stats
    pullSchoolUsageStats(lang);
  }, [lang]);

  React.useEffect(() => {
    setChartData(schoolUsageStats ?? null);
  }, [lang, schoolUsageStats]);

  return (
    <Widget
      title={intl.formatMessage({ id: 'dashboard.school_usage.stats' })}
      subheader={intl.formatMessage({ id: 'dashboard.school_usage.stats_description' })}
    >
      <Box
        sx={{
          fontFamily: fontFamily,
          fontSize: '0.6rem',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {(chartData && (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData}>
              <XAxis dataKey='title' />
              <Tooltip />
              <Bar
                dataKey='usage'
                fill={
                  theme.palette.mode === 'light'
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark
                }
              />
            </BarChart>
          </ResponsiveContainer>
        )) || <CircularProgress size={20} />}
      </Box>
    </Widget>
  );
};

export default connector(SchoolUsageChart);
