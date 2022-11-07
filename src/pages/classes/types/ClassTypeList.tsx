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
import { faPlus } from '@fortawesome/pro-duotone-svg-icons';

import Page from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';
import { AppDispatch, RootState } from 'store/store';
import useTranslation from 'hooks/useTranslation';
import SchoostDialog from 'components/SchoostDialog';
import RowActions from 'components/table/RowActions';

import {
  classTypesSelector,
  classTypesPhaseSelector,
  classTypesActions
} from './_store/classTypes';
import ClassTypeForm from './ClassTypeForm';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  classTypes: classTypesSelector(state),
  phase: classTypesPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullClassTypes: () => dispatch(classTypesActions.pullClassTypes())
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TStudentTagsProps = PropsFromRedux;

const ClassTypeList: React.FC<TStudentTagsProps> = (props) => {
  const { classTypes, phase, pullClassTypes } = props;

  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { id, action } = useParams();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));

  const transClassTypes = intl.translate({ id: 'class.types' });
  const transClassType = intl.translate({ id: 'class.type' });

  const columns: GridColDef[] = [
    { field: 'title', headerName: intl.translate({ id: 'class.type.title' }), flex: 2 },
    {
      field: 'id',
      headerName: intl.translate({ id: 'app.actions' }),
      width: mobileDevice ? 100 : 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <RowActions
          params={params}
          onEditClick={() => navigate(`/classes/types/${params.row.id}/edit`)}
        />
      )
    }
  ];

  const handleCloseConfirm = () => {
    navigate('/classes/types');
    setShowConfirmDialog(false);
  };

  React.useEffect(() => {
    pullClassTypes();
  }, []);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      classTypes && classTypes.length && classTypes.findIndex((g) => g.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, classTypes, showConfirmDialog, setShowConfirmDialog]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'class.types', url: '/classes/types' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={transClassTypes}>
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
            title={transClassTypes}
            action={
              <Button
                onClick={() => navigate(`/classes/types/new`)}
                startIcon={<FontAwesomeIcon className='fa-w-12' icon={faPlus} fontSize={10} />}
              >
                {intl.translate({ id: 'app.add.something' }, { something: transClassType })}
              </Button>
            }
          />
          <Divider />

          <CardContent sx={{ display: 'flex', height: 671, width: '100%' }}>
            <DataGridPro
              pagination
              pageSize={10}
              rowsPerPageOptions={[5, 10, 50]}
              loading={phase === 'loading'}
              rows={classTypes || []}
              columns={columns}
            />
          </CardContent>
        </Card>
      </Box>

      {/* <AddFabButton title='ADD' onClick={() => navigate(`/classes/types/new`)} /> */}

      {action === 'edit' && (
        <SchoostDialog
          title={intl.translate({ id: 'app.edit' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/classes/types')}
        >
          <ClassTypeForm actionType={action} handleClose={() => navigate('/classes/types')} />
        </SchoostDialog>
      )}
    </Page>
  );
};

export default connector(ClassTypeList);
