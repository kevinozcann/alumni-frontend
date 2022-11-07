import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { GridColDef, GridValueGetterParams, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinusCircle,
  faPlusCircle,
  faExclamationCircle
} from '@fortawesome/pro-duotone-svg-icons';
import Page from 'layout/Page';
import Scrollbar from 'layout/Scrollbar';
import { AppDispatch, RootState } from 'store/store';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import RowActions from 'components/table/RowActions';
import ConfirmDialog from 'components/ConfirmDialog';
import SchoostDialog from 'components/SchoostDialog';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'store/user';
import {
  IincomeExpense,
  incomeExpensesActions,
  incomeExpensesPhaseSelector,
  incomeExpensesSelector
} from './_store/income-expense';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import IncomeExpenseForm from './IncomeExpenseForm';
import { darken, lighten } from '@mui/material/styles';
import StatsBox from 'components/dashboard/StatsBox';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const getBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  incomeExpenses: incomeExpensesSelector(state),
  phase: incomeExpensesPhaseSelector(state)
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullIncomeExpenses: (activeSchool: ISchool, activeSeason: ISeason) =>
    dispatch(incomeExpensesActions.pullIncomeExpenses(activeSchool, activeSeason)),
  deleteIncomeExpense: (id: number) => dispatch(incomeExpensesActions.deleteIncomeExpense(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TIncomeExpenseProps = PropsFromRedux;

const IncomeExpenseList = (props: TIncomeExpenseProps) => {
  const {
    incomeExpenses,
    phase,
    activeSchool,
    activeSeason,
    pullIncomeExpenses,
    deleteIncomeExpense
  } = props;
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const { id, action } = useParams();

  const pageTitle = intl.translate({ id: 'income.expense' });
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const [totalIncomes, setTotalIncomes] = React.useState<number>(0);
  const [totalExpenses, setTotalExpenses] = React.useState<number>(0);
  const [totalOthers, setTotalOthers] = React.useState<number>(0);

  const columns: GridColDef[] = [
    {
      field: 'accountCodeNumber',
      headerName: intl.translate({ id: 'account.code' }),
      headerAlign: 'center',
      flex: 2
    },
    {
      field: 'accountCodeName',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'account.name' }),
      flex: 2
    },
    {
      field: 'institutionTitle',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'name_surname_title' }),
      flex: 2
    },
    {
      field: 'addedAt',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'app.date' }),
      align: 'center',
      flex: 2,
      renderCell: (params: GridValueGetterParams) => format(new Date(params.row.addedAt), 'Pp')
    },
    {
      field: 'amount',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'app.amount' }),
      align: 'center',
      flex: 2,
      renderCell: (params: GridValueGetterParams) =>
        params.row.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    },
    {
      field: 'explanation',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'online.class.description' }),
      flex: 2
    },
    {
      field: 'id',
      headerName: intl.translate({ id: 'app.actions' }),
      width: mobileDevice ? 100 : 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <RowActions
          params={params}
          onEditClick={() => navigate(`/income-expense/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/income-expense/${params.row.id}/delete`)}
        />
      )
    }
  ];

  const handleCloseConfirm = () => {
    navigate('/income-expense');
    setShowConfirmDialog(false);
  };

  const handleDeleteConfirm = () => {
    deleteIncomeExpense(parseInt(id));
  };

  React.useEffect(() => {
    const tIncomes = () => {
      return incomeExpenses?.filter(
        (incomes: Partial<IincomeExpense>) => incomes.accountCodeType === '1'
      );
    };

    const tExpenses = () => {
      return incomeExpenses?.filter(
        (incomes: Partial<IincomeExpense>) => incomes.accountCodeType === '2'
      );
    };

    const tOthers = () => {
      return incomeExpenses?.filter(
        (incomes: Partial<IincomeExpense>) => incomes.accountCodeType === '3'
      );
    };

    setTotalIncomes(tIncomes().reduce((a, v) => (a = a + v.amount), 0));
    setTotalExpenses(tExpenses().reduce((a, v) => (a = a + v.amount), 0));
    setTotalOthers(tOthers().reduce((a, v) => (a = a + v.amount), 0));
  }, [incomeExpenses, totalIncomes, totalExpenses]);

  React.useEffect(() => {
    pullIncomeExpenses(activeSchool, activeSeason);
  }, [activeSchool, activeSeason]);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      incomeExpenses &&
      incomeExpenses.length &&
      incomeExpenses.findIndex((g) => g.id === parseInt(id));

    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, incomeExpenses, showConfirmDialog, setShowConfirmDialog]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'income.expense', url: '/income-expense' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={pageTitle}>
      <Box sx={{ mb: 1 }}>
        <Grid container spacing={1} justifyContent='space-between' alignItems='flex-start'>
          <Grid item xs={12} md={4}>
            <StatsBox
              boxStyle='success'
              title={intl.formatMessage({
                id: 'income.expense.total_income'
              })}
              icon={faPlusCircle}
              value={totalIncomes.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsBox
              boxStyle='danger'
              title={intl.formatMessage({
                id: 'income.expense.total_expense'
              })}
              icon={faMinusCircle}
              value={totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsBox
              boxStyle='warning'
              title={intl.formatMessage({
                id: 'income.expense.total_other'
              })}
              icon={faExclamationCircle}
              value={totalOthers.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          '& .super-app-theme--1': {
            bgcolor: (theme) => getBackgroundColor(theme.palette.success.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBackgroundColor(theme.palette.success.main, theme.palette.mode)
            }
          },
          '& .super-app-theme--3': {
            bgcolor: (theme) => getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBackgroundColor(theme.palette.warning.main, theme.palette.mode)
            }
          },
          '& .super-app-theme--2': {
            bgcolor: (theme) => getBackgroundColor(theme.palette.error.main, theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) =>
                getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode)
            }
          }
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader
            title={pageTitle}
            action={
              <Button
                onClick={() => navigate(`/income-expense/new`)}
                startIcon={<FontAwesomeIcon className='fa-w-12' icon={faPlus} fontSize={10} />}
              >
                {intl.translate({ id: 'app.add' })}
              </Button>
            }
          />

          <Divider />

          <Scrollbar>
            <CardContent sx={{ display: 'flex', height: 671, width: '100%' }}>
              <DataGridPro
                pagination
                pageSize={10}
                rowsPerPageOptions={[5, 10, 50]}
                loading={phase === 'loading'}
                rows={incomeExpenses}
                columns={columns}
                getRowClassName={(params) => `super-app-theme--${params.row.accountCodeType}`}
              />
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>

      {action === 'edit' && (
        <SchoostDialog
          title={intl.formatMessage({ id: 'app.edit' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/income-expense')}
        >
          <IncomeExpenseForm actionType={action} handleClose={() => navigate('/income-expense')} />
        </SchoostDialog>
      )}

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
        phase={phase}
      />
    </Page>
  );
};

export default connector(IncomeExpenseList);
