import { faFemale, faMale } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { DataGridPro, GridColDef, GridValueGetterParams, LicenseInfo } from '@mui/x-data-grid-pro';
import { format } from 'date-fns';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';

import RowActions from 'components/table/RowActions';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import Page from 'layout/Page';
import Scrollbar from 'layout/Scrollbar';
import { IAuthUser } from 'pages/auth/data/account-types';
import { ISchool } from 'pages/organization/organization-types';
import { authUserSelector } from 'pages/auth/services/store/auth';
import { i18nLangSelector } from 'store/i18n';
import { AppDispatch, RootState } from 'store/store';
import { userProfileSelector } from 'pages/profile/services/store/user';
import { toAbsoluteUrl } from '../../../utils/AssetsHelpers';
import { IStudent } from '../_store/types';
import { studentsActions, studentsPhaseSelector } from './_store/students';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  userPersonal: userProfileSelector(state),
  user: authUserSelector(state),
  phase: studentsPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullStudents: (user: IAuthUser, userPersonal: IAuthUser, school: ISchool) =>
    dispatch(studentsActions.pullStudents(user, userPersonal, school))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TStudentsProps = PropsFromRedux;

const StudentList: React.FC<TStudentsProps> = (props) => {
  const { phase, user, userPersonal, pullStudents } = props;
  const intl = useTranslation();
  const theme = useTheme();
  const subheader = useSubheader();
  const navigate = useNavigate();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));
  const [allStudents, setAllStudents] = React.useState<IStudent[]>([]);

  const transStudents = intl.translate({ id: 'school.students' });

  const columns: GridColDef[] = [
    {
      field: 'photo',
      headerName: intl.translate({ id: 'post.photo' }),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <Avatar
          alt='username'
          src={params.row.photo ?? toAbsoluteUrl('/media/users/default.jpg')}
        />
      )
    },
    {
      field: 'studentNumber',
      headerName: intl.translate({ id: 'student.no' }),
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'fullName', headerName: intl.translate({ id: 'name_and_latname' }), flex: 2 },
    {
      field: 'stdUniqueId',
      headerName: intl.translate({ id: 'id_number' }),
      flex: 1,
      hide: mobileDevice ? true : false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'gender',
      headerName: intl.translate({ id: 'gender' }),
      flex: 1,
      hide: mobileDevice ? true : false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <FontAwesomeIcon icon={params.row.gender === 'E' ? faMale : faFemale} fontSize={25} />
      )
    },
    {
      field: 'placeOfBirth',
      headerName: intl.translate({ id: 'place_of_birth' }),
      flex: 1,
      hide: mobileDevice ? true : false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'dateOfBirth',
      headerName: intl.translate({ id: 'date_of_birth' }),
      flex: 1,
      hide: mobileDevice ? true : false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) =>
        params.row.dateOfBirth !== '0000-00-00' ? format(new Date(params.row.dateOfBirth), 'P') : ''
    },
    {
      field: 'batchNames',
      headerName: intl.translate({ id: 'batch' }),
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'courseNames',
      headerName: intl.translate({ id: 'batch_level' }),
      flex: 2,
      hide: mobileDevice ? true : false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'enrollmentDate',
      headerName: intl.translate({ id: 'enrollment_date' }),
      flex: 1,
      hide: mobileDevice ? true : false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) =>
        format(new Date(params.row.enrollmentDate), 'P')
    },
    {
      field: 'id',
      headerName: intl.translate({ id: 'app.actions' }),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <RowActions params={params} onShowClick={() => navigate(`/student/${params.row.id}`)} />
      )
    }
  ];

  // React.useEffect(() => {
  //   const std = [];

  //   const filteredStudents = () => {
  //     return teacherClasses
  //       .filter((t: ITeacherClasses) => t.classStudents)
  //       .map((x) => x.classStudents);
  //   };

  //   const students = filteredStudents();
  //   students.map((s) => {
  //     return s.map((tt) => {
  //       const findItem = std.find((x) => x.id === tt.id);
  //       if (!findItem) std.push(tt);
  //     });
  //   });
  //   setAllStudents(std);
  // }, []);

  // React.useEffect(() => {
  //   pullStudents(user, userPersonal, activeSchool);
  // }, [activeSchool]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'school.students', url: '/student' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={transStudents}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title={transStudents} />
          <Divider />
          <Scrollbar>
            <CardContent sx={{ display: 'flex', height: 671, width: '100%' }}>
              <DataGridPro
                pagination
                pageSize={10}
                rowsPerPageOptions={[5, 10, 50]}
                loading={phase === 'student-loading'}
                rows={allStudents}
                columns={columns}
              />
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>
    </Page>
  );
};

export default connector(StudentList);
