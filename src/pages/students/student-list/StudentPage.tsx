import { lazy } from '@loadable/component';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Skeleton,
  Tab,
  Tabs
} from '@mui/material';
import { LoadableScreen } from 'layout';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { IBreadcrumb } from 'components/BreadCrumbs';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import Page from 'layout/Page';
import { i18nLangSelector } from 'store/i18n';
import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector } from 'pages/profile/services/user';
import { IPageTab } from 'utils/shared-types';
import studentPageTabs from './student-page-tabs';
import { studentInfoSelector, studentsActions, studentsPhaseSelector } from './_store/students';

const Schoolinfo = LoadableScreen(lazy(() => import('./student-pages/Schoolinfo')));

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  studentInfo: studentInfoSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  phase: studentsPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullStudentInfo: (id: number) => dispatch(studentsActions.pullStudentInfo(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TStudentPageProps = PropsFromRedux;

const StudentPage: React.FC<TStudentPageProps> = (props) => {
  const { activeSchool, phase, studentInfo, pullStudentInfo } = props;
  const { id, section } = useParams();
  const navigate = useNavigate();
  const intl = useTranslation();
  const subheader = useSubheader();

  // Handle tab change by user
  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    navigate(`/student/${id}/${newValue}`);
  };
  // Check if the id is manually changed
  React.useEffect(() => {
    if (
      !studentPageTabs
        .filter((t) => t.visible.includes(activeSchool.type))
        .some((t) => t.value === section)
    ) {
      //navigate(`/student/${studentInfo.id}/school-info`);
      navigate(`/student/${id}/school-info`);
    }
  }, [navigate, section, id, activeSchool]);

  React.useEffect(() => {
    pullStudentInfo(parseInt(id));
  }, [id, activeSchool, pullStudentInfo]);

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({
      title: intl.translate({ id: 'school.students' }),
      url: '/student',
      original: true
    });
    breadcrumbs.push({
      title: intl.translate({ id: 'student.student_page' }),
      url: `/student/${id}`,
      original: true
    });
    subheader.setBreadcrumbs(breadcrumbs);
  }, [id, intl, subheader]);

  return (
    <Page title={intl.translate({ id: 'student.student_page' })}>
      <Grid container>
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs>
            <Box>
              <Tabs
                value={section}
                onChange={handleTabChange}
                indicatorColor='primary'
                textColor='primary'
                scrollButtons='auto'
                variant='scrollable'
                aria-label='page tabs'
              >
                {studentPageTabs.map((tab: IPageTab) => (
                  <Tab
                    key={tab.value}
                    label={intl.formatMessage({ id: tab.label })}
                    value={tab.value}
                  />
                ))}
              </Tabs>
            </Box>
            <Divider />

            <Box sx={{ mt: 3 }}>
              {(phase === 'student-loading' && (
                <Box>
                  <Card style={{ marginBottom: 24 }}>
                    <CardHeader
                      avatar={
                        <Skeleton variant='circular'>
                          <Avatar />
                        </Skeleton>
                      }
                      title={
                        <Skeleton
                          animation='wave'
                          height={10}
                          width='40%'
                          style={{ marginBottom: 6 }}
                        />
                      }
                      subheader={<Skeleton animation='wave' height={10} width='20%' />}
                    />
                  </Card>
                  <Card>
                    <Skeleton sx={{ m: 2 }} height={30} width='30%' variant='text' />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                          <Skeleton height={45} width='100%' variant='rectangular' />
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Skeleton height={45} width='100%' variant='rectangular' />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )) ||
                (section === 'school-info' && <Schoolinfo studentInfo={studentInfo} />)}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default connector(StudentPage);
