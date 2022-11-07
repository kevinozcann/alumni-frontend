import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import Page from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import GradeLevelsForm from 'pages/config/grade-levels/GradeLevelsForm';

const NewGradeLevel = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const pageTitle = intl.translate({ id: 'school.grades' });
  const pageNewTitle = intl.translate({ id: 'app.add.something' }, { something: pageTitle });

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'config', url: '/config' });
    breadcrumbs.push({ title: 'school.grades', url: '/config/grade-levels' });
    breadcrumbs.push({ title: 'app.add', url: '/config/grade-levels/new' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={`${pageNewTitle}`}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title={pageNewTitle} />
          <Divider />
          <CardContent>
            <GradeLevelsForm
              actionType='add'
              handleClose={() => navigate('/config/grade-levels')}
            />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewGradeLevel;
