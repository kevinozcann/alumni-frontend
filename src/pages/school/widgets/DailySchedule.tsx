import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Box } from '@mui/material';
import { AppDispatch, RootState } from '../../../store/store';
import { fontFamily } from '../../../theme';
import Widget from '../../../components/dashboard/Widget';
import useTranslation from 'hooks/useTranslation';
import { userActiveSchoolSelector } from 'store/user';
import {
  schedulePhaseSelector,
  schedulesActions,
  scheduleSelector
} from 'pages/schedule/_store/schedule';
import { ISchool } from 'pages/organization/organization-types';
import { GridColDef, GridValueGetterParams, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';
import { format } from 'date-fns';
import Scrollbar from 'layout/Scrollbar';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  schedules: scheduleSelector(state),
  schedulePhase: schedulePhaseSelector(state)
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullSchedules: (school: ISchool) => dispatch(schedulesActions.pullSchedules(school))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TDailyScheduleProps = PropsFromRedux;

const DailySchedule: React.FC<TDailyScheduleProps> = (props) => {
  const { activeSchool, schedules, schedulePhase, pullSchedules } = props;
  const intl = useTranslation();
  const columns: GridColDef[] = [
    {
      field: 'scheduleDate',
      headerName: intl.translate({ id: 'app.date' }),
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      renderCell: (params: GridValueGetterParams) => format(new Date(params.row.scheduleDate), 'P')
    },
    {
      field: 'enterTime',
      headerAlign: 'center',
      align: 'center',
      headerName: intl.translate({ id: 'schedule.enter_time' }),
      flex: 2
    },
    {
      field: 'exitTime',
      headerAlign: 'center',
      align: 'center',
      headerName: intl.translate({ id: 'schedule.exit_time' }),
      flex: 2
    },
    {
      field: 'batchCodes',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'batch' }),
      align: 'center',
      flex: 2,
      renderCell: (params: GridValueGetterParams) => params.row.batchCodes?.title
    },
    {
      field: 'teacherId',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'online.class.teacher' }),
      align: 'center',
      flex: 2,
      renderCell: (params: GridValueGetterParams) => params.row.teacherId?.name
    },
    {
      field: 'classId',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'class' }),
      flex: 2,
      renderCell: (params: GridValueGetterParams) => params.row.classId?.title
    },
    {
      field: 'classTypeId',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'class.type' }),
      flex: 2,
      align: 'center',
      renderCell: (params: GridValueGetterParams) => params.row.classTypeId?.title
    }
  ];

  React.useEffect(() => {
    pullSchedules(activeSchool);
  }, [activeSchool]);

  return (
    <Widget height='400px' title={intl.formatMessage({ id: 'schedule.daily_schedule' })}>
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
        <Scrollbar style={{ width: '100%' }}>
          <DataGridPro
            autoHeight={true}
            loading={schedulePhase === 'loading'}
            rows={schedules}
            columns={columns}
            disableColumnMenu
            disableSelectionOnClick
          />
        </Scrollbar>
      </Box>
    </Widget>
  );
};

export default connector(DailySchedule);
