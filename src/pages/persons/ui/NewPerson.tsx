import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import PersonForm from './PersonForm';
import { IBreadcrumb } from 'components/BreadCrumbs';

const NewPerson = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const transStudents = intl.translate({ id: 'person.alumni_students' });
  const transAddStudent = intl.translate({ id: 'student.add' });

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transStudents, url: '/persons', original: true });
    breadcrumbs.push({ title: transAddStudent, url: '/persons/new', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={transAddStudent}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title={transAddStudent} />
          <Divider />
          <CardContent>
            <PersonForm actionType='add' handleClose={() => navigate('/persons')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewPerson;
