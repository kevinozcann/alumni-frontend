import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { IBreadcrumb } from 'pages/admin/menu-types';
import AccountCodeForm from './AccountCodeForm';

const AccountCodeNew = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const pageTitle = intl.translate({ id: 'account.code' });
  const pageNewTitle = intl.translate({ id: 'app.add.something' }, { something: pageTitle });

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: 'account.codes', url: '/account-codes' });
    breadcrumbs.push({ title: pageNewTitle, url: '/account-codes/new', original: true });
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
            <AccountCodeForm actionType='add' handleClose={() => navigate('/account-codes')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default AccountCodeNew;
