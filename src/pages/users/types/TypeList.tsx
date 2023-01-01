import React, { useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/pro-duotone-svg-icons';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { GridColDef, GridValueGetterParams, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';

import Page from 'layout/Page';
import Scrollbar from 'layout/Scrollbar';
import { AppDispatch, RootState } from 'store/store';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { AddFabButton } from 'utils/ActionLinks';
import RowActions from 'components/table/RowActions';
import ConfirmDialog from 'components/ConfirmDialog';
import AppDialog from 'components/AppDialog';

import { userTypesActions, userTypesSelector, userTypesPhaseSelector } from './_store/user-types';
import UserTypesForm from './UserTypesForm';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  userTypes: userTypesSelector(state),
  phase: userTypesPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullUserTypes: () => dispatch(userTypesActions.pullUserTypes()),
  deleteUserType: (id: number) => dispatch(userTypesActions.deleteUserType(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TUserTypesProps = PropsFromRedux;

const TypeList = (props: TUserTypesProps) => {
  const { userTypes, phase, pullUserTypes, deleteUserType } = props;
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const { id, action } = useParams();

  const pageTitle = intl.translate({ id: 'user.types' });
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const columns: GridColDef[] = [
    { field: 'userType', headerName: intl.translate({ id: 'user.type' }), flex: 2 },
    {
      field: 'isActive',
      headerName: intl.translate({ id: 'app.active' }),
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) =>
        params.row.isActive === '1' ? (
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
      renderCell: (params: GridValueGetterParams) =>
        params.row.isEditable === '1' ? (
          <RowActions
            params={params}
            onEditClick={() => navigate(`/users/types/${params.row.id}/edit`)}
            onDeleteClick={() => navigate(`/users/types/${params.row.id}/delete`)}
          />
        ) : (
          ''
        )
    }
  ];

  const handleCloseConfirm = useCallback(() => {
    navigate('/users/types');
    setShowConfirmDialog(false);
  }, [navigate]);

  const handleDeleteConfirm = () => {
    deleteUserType(parseInt(id));
  };

  React.useEffect(() => {
    pullUserTypes();
  }, [pullUserTypes]);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      userTypes && userTypes.length && userTypes.findIndex((g) => g.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, userTypes, showConfirmDialog, setShowConfirmDialog, handleCloseConfirm]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'user.types', url: '/users/types' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, [subheader]);

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
          <CardHeader title={pageTitle} />
          <Divider />
          <Scrollbar>
            <CardContent sx={{ display: 'flex', height: 671, width: '100%' }}>
              <DataGridPro
                pagination
                pageSize={10}
                rowsPerPageOptions={[5, 10, 50]}
                loading={phase === 'loading'}
                rows={userTypes}
                columns={columns}
              />
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>

      <AddFabButton title='ADD' onClick={() => navigate(`/users/types/new`)} />

      {action === 'edit' && (
        <AppDialog
          title={intl.formatMessage({ id: 'app.edit' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/users/types')}
        >
          <UserTypesForm actionType={action} handleClose={() => navigate('/users/types')} />
        </AppDialog>
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

export default connector(TypeList);
