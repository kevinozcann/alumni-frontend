import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { IBreadcrumb } from 'components/BreadCrumbs';

import ClassForm from './ClassForm';

const NewClass = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const transclass = intl.translate({ id: 'class' });
  const transClass = intl.translate({ id: 'classes' });
  const transAddclass = intl.translate({ id: 'app.add.something' }, { something: transclass });

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transClass, url: '/classes/classes', original: true });
    breadcrumbs.push({ title: transAddclass, url: '/classes/classes/new', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={`${transAddclass}`}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title={transAddclass} />
          <Divider />

          <CardContent>
            <ClassForm actionType='add' handleClose={() => navigate('/classes/classes')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewClass;
