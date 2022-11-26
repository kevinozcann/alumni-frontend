import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { IBreadcrumb } from 'pages/admin/menu-types';

import ClassTypeForm from '../ClassTypeForm';

const NewClassType = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const pageTitle = intl.translate({ id: 'class.type' });
  const pageNewTitle = intl.translate({ id: 'app.add.something' }, { something: pageTitle });

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: 'class.types', url: '/classes/types' });
    breadcrumbs.push({ title: pageNewTitle, url: '/classes/types/new', original: true });
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
            <ClassTypeForm actionType='add' handleClose={() => navigate('/classes/types')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewClassType;
