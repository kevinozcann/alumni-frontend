import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { IStudent, IStudentCourses } from 'pages/students/_store/types';
import StudentHeader from '../StudentHeader';

type TSchoolinfoProps = {
  studentInfo: IStudent;
  phase: string;
};

const Schoolinfo = (props: TSchoolinfoProps) => {
  const { studentInfo } = props;
  const intl = useIntl();

  return (
    <Box>
      <StudentHeader studentInfo={studentInfo} />
      <Card>
        <CardHeader title={intl.formatMessage({ id: 'school.info' })} />
        <Divider />
        <CardContent sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            {studentInfo.studentCourses &&
              studentInfo.studentCourses.map((stdCourse: IStudentCourses) => (
                <Grid key={stdCourse.title} item xs={12} md={12}>
                  <Card>
                    <CardHeader title={stdCourse.title} subheader={stdCourse.courseBatch?.title} />
                  </Card>
                </Grid>
              ))}

            {studentInfo.guide && (
              <Grid item xs={12} md={12}>
                <Card>
                  <CardHeader
                    title={intl.formatMessage({ id: 'guidance.guidance_counselor' })}
                    subheader={studentInfo.guide.name}
                  />
                </Card>
              </Grid>
            )}

            {studentInfo.advisor && (
              <Grid item xs={12} md={12}>
                <Card>
                  <CardHeader
                    title={intl.formatMessage({ id: 'advisor_teacher' })}
                    subheader={studentInfo.advisor.name}
                  />
                </Card>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Schoolinfo;
