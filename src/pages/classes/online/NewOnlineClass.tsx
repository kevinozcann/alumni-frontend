import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { IBreadcrumb } from 'pages/admin/menu-types';

import ClassTypesForm from './OnlineClassForm';

const NewOnlineClass = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const transOnlineClass = intl.translate({ id: 'online.class' });
  const transAddOnlineClass = intl.translate(
    { id: 'online.class.add' },
    { something: transOnlineClass }
  );

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: 'online.classes', url: '/classes/online' });
    breadcrumbs.push({ title: transAddOnlineClass, url: '/classes/online/new', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={`${transAddOnlineClass}`}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title={transOnlineClass} />
          <Divider />
          <CardContent>
            <ClassTypesForm actionType='add' handleClose={() => navigate('/classes/online')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewOnlineClass;
