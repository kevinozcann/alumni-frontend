import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import { IBreadcrumb } from 'pages/admin/menu-types';
import UserTypesForm from 'pages/users/types/UserTypesForm';

const NewUserType = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const pageTitle = intl.translate({ id: 'user.type' });
  const pageNewTitle = intl.translate({ id: 'app.add.something' }, { something: pageTitle });

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: 'user.types', url: '/users/types' });
    breadcrumbs.push({ title: pageNewTitle, url: '/users/types/new', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, [pageNewTitle, subheader]);

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
            <UserTypesForm actionType='add' handleClose={() => navigate('/users/types')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewUserType;
