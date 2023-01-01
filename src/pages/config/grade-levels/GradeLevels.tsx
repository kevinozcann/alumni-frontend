import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { LicenseInfo, DataGridPro, GridColDef, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/pro-duotone-svg-icons';

import Page from 'layout/Page';
import Scrollbar from 'layout/Scrollbar';
import { AppDispatch, RootState } from 'store/store';
import { configActions, configPhaseSelector, gradeLevelsSelector } from 'store/config';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import AppDialog from 'components/AppDialog';
import SideForm from 'components/SideForm';
import ConfirmDialog from 'components/ConfirmDialog';
import RowActions from 'components/table/RowActions';
import { AddFabButton } from 'utils/ActionLinks';

import GradeLevelsForm from './GradeLevelsForm';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  gradeLevels: gradeLevelsSelector(state),
  phase: configPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullGradeLevels: (active: boolean) => dispatch(configActions.pullGradeLevels(active)),
  deleteGradeLevel: (id: number) => dispatch(configActions.deleteGradeLevel(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TGradeLevelsProps = PropsFromRedux;

const GradeLevels: React.FC<TGradeLevelsProps> = (props) => {
  const { gradeLevels, phase, pullGradeLevels, deleteGradeLevel } = props;
  const { id, action } = useParams();
  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));

  const pageTitle = intl.translate({ id: 'config.grades' });

  const columns: GridColDef[] = [
    { field: 'gradeName', headerName: intl.translate({ id: 'school.grade' }), flex: 2 },
    {
      field: 'gradeShortName',
      headerName: intl.translate({ id: 'abbreviation' }),
      flex: 1,
      hide: mobileDevice ? true : false
    },
    {
      field: 'tag',
      headerName: intl.translate({ id: 'tag' }),
      hide: mobileDevice ? true : false,
      flex: 1,
      sortable: false
    },
    {
      field: 'active',
      headerName: intl.translate({ id: 'app.active' }),
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) =>
        params.row.active ? (
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
          onEditClick={() => navigate(`/config/grade-levels/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/config/grade-levels/${params.row.id}/delete`)}
          onShowClick={
            mobileDevice ? null : () => navigate(`/config/grade-levels/${params.row.id}`)
          }
        />
      )
    }
  ];

  const handleDeleteConfirm = () => {
    deleteGradeLevel(parseInt(id));
  };

  const handleCloseConfirm = () => {
    navigate('/config/grade-levels');
    setShowConfirmDialog(false);
  };

  React.useEffect(() => {
    pullGradeLevels(false);
  }, []);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      gradeLevels && gradeLevels.length && gradeLevels.findIndex((g) => g.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, gradeLevels, showConfirmDialog, setShowConfirmDialog]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'config', url: '/config' });
    breadcrumbs.push({ title: 'config.grades', url: '/config/grade-levels' });
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
          <CardHeader title={pageTitle} />
          <Divider />
          <Scrollbar>
            <CardContent sx={{ display: 'flex', height: 671, width: '100%' }}>
              <DataGridPro
                pagination
                pageSize={10}
                rowsPerPageOptions={[5, 10, 50]}
                loading={!gradeLevels}
                rows={gradeLevels}
                columns={columns}
              />

              {id && !action && (
                <SideForm handleClickClose={() => navigate('/config/grade-levels')}>
                  <GradeLevelsForm
                    sideForm={true}
                    actionType='show'
                    handleClose={() => navigate('/config/grade-levels')}
                  />
                </SideForm>
              )}
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>

      <AddFabButton
        title={intl.translate({ id: 'app.add' })}
        onClick={() => navigate(`/config/grade-levels/new`)}
      />

      {action === 'edit' && (
        <AppDialog
          title={intl.translate({ id: 'app.add' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/config/grade-levels')}
        >
          <GradeLevelsForm
            actionType={action}
            handleClose={() => navigate('/config/grade-levels')}
          />
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

export default connector(GradeLevels);
