import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';
import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { IBreadcrumb } from 'pages/admin/menu-types';
import IncomeExpenseForm from './IncomeExpenseForm';

const IncomeExpenseNew = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const pageTitle = intl.translate({ id: 'income.expense' });
  const pageNewTitle = intl.translate({ id: 'app.add.something' }, { something: pageTitle });

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: 'income.expense', url: '/income-expense' });
    breadcrumbs.push({ title: pageNewTitle, url: '/income-expense/new', original: true });
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
            <IncomeExpenseForm actionType='add' handleClose={() => navigate('/income-expense')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default IncomeExpenseNew;
