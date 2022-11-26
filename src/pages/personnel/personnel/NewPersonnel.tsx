import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { IBreadcrumb } from 'pages/admin/menu-types';

import PersonnelForm from './PersonnelForm';

const NewPersonnel = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const transPerson = intl.translate({ id: 'person' });
  const transPersonnel = intl.translate({ id: 'personnel' });
  const transAddPerson = intl.translate({ id: 'app.add.something' }, { something: transPerson });

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transPersonnel, url: '/personnel/personnel', original: true });
    breadcrumbs.push({ title: transAddPerson, url: '/personnel/personnel/new', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={`${transAddPerson}`}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title={transAddPerson} />
          <Divider />

          <CardContent>
            <PersonnelForm actionType='add' handleClose={() => navigate('/personnel/personnel')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewPersonnel;
