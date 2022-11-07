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
  useMediaQuery,
  useTheme
} from '@mui/material';
import { GridColDef, GridValueGetterParams, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faPlus } from '@fortawesome/pro-duotone-svg-icons';
import Page from 'layout/Page';
import Scrollbar from 'layout/Scrollbar';
import { AppDispatch, RootState } from 'store/store';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import RowActions from 'components/table/RowActions';
import ConfirmDialog from 'components/ConfirmDialog';
import SchoostDialog from 'components/SchoostDialog';
import {
  accountCodesActions,
  accountCodesPhaseSelector,
  accountCodesSelector
} from './_store/account-codes';
import { userActiveSchoolSelector } from 'store/user';
import { ISchool } from 'pages/organization/organization-types';
import AccountCodeForm from './AccountCodeForm';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  accountCodes: accountCodesSelector(state),
  phase: accountCodesPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullAccountCodes: (activeSchool: ISchool) =>
    dispatch(accountCodesActions.pullAccountCodes(activeSchool)),
  deleteAccountCode: (id: number) => dispatch(accountCodesActions.deleteAccountCode(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAccountCodesProps = PropsFromRedux;

const CodeList = (props: TAccountCodesProps) => {
  const { accountCodes, phase, activeSchool, pullAccountCodes, deleteAccountCode } = props;
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const { id, action } = useParams();

  const pageTitle = intl.translate({ id: 'account.codes' });
  const transAccountCode = intl.translate({ id: 'account.code' });
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const columns: GridColDef[] = [
    { field: 'accountCode', headerName: intl.translate({ id: 'account.code' }), flex: 2 },
    { field: 'accountName', headerName: intl.translate({ id: 'account.name' }), flex: 2 },
    {
      field: 'explanation',
      headerName: intl.translate({ id: 'online.class.description' }),
      flex: 2
    },
    {
      field: 'isActive',
      headerName: intl.translate({ id: 'app.active' }),
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) =>
        params.row.isActive == '1' ? (
          <FontAwesomeIcon size='lg' color='green' icon={faCheckCircle} />
        ) : (
          <FontAwesomeIcon size='lg' color='red' icon={faTimesCircle} />
        )
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
          onEditClick={() => navigate(`/account-codes/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/account-codes/${params.row.id}/delete`)}
        />
      )
    }
  ];

  const handleCloseConfirm = () => {
    navigate('/account-codes');
    setShowConfirmDialog(false);
  };

  const handleDeleteConfirm = () => {
    deleteAccountCode(parseInt(id));
  };

  React.useEffect(() => {
    pullAccountCodes(activeSchool);
  }, []);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      accountCodes && accountCodes.length && accountCodes.findIndex((g) => g.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, accountCodes, showConfirmDialog, setShowConfirmDialog]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'account.codes', url: '/account-codes' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={pageTitle}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader
            title={pageTitle}
            action={
              <Button
                onClick={() => navigate(`/account-codes/new`)}
                startIcon={<FontAwesomeIcon className='fa-w-12' icon={faPlus} fontSize={10} />}
              >
                {intl.translate({ id: 'app.add.something' }, { something: transAccountCode })}
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
                rows={accountCodes}
                columns={columns}
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
          handleClose={() => navigate('/account-codes')}
        >
          <AccountCodeForm actionType={action} handleClose={() => navigate('/account-codes')} />
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

export default connector(CodeList);
