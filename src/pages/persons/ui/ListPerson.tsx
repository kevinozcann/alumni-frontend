import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useMediaQuery,
  Button,
  useTheme,
  Avatar
} from '@mui/material';
import { format } from 'date-fns';
import RowActions from 'components/table/RowActions';
import ConfirmDialog from 'components/ConfirmDialog';
import AppDialog from 'components/AppDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-duotone-svg-icons';
import {
  GridColDef,
  LicenseInfo,
  DataGridPro,
  GridValueGetterParams,
  GridToolbarQuickFilter
} from '@mui/x-data-grid-pro';
import useTranslation from 'hooks/useTranslation';
import Page from 'layout/Page';
import Scrollbar from 'layout/Scrollbar';
import { useSubheader } from 'contexts/SubheaderContext';
import { personsSelector, personsPhaseSelector, personActions } from '../services/persons';
import { AppDispatch, RootState } from 'store/store';
import PersonForm from './PersonForm';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  persons: personsSelector(state),
  phase: personsPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullPersons: () => dispatch(personActions.pullPersons()),
  deletePerson: (id: string) => dispatch(personActions.deletePerson(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TPersonsProps = PropsFromRedux;

const ListPerson: React.FC<TPersonsProps> = (props) => {
  const { persons, phase, pullPersons, deletePerson } = props;
  const navigate = useNavigate();
  const subheader = useSubheader();
  const intl = useTranslation();
  const theme = useTheme();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { id, action } = useParams();

  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));
  const transStudents = intl.translate({ id: 'person.alumni_students' });

  const columns: GridColDef[] = [
    {
      field: 'student_picture',
      headerName: intl.translate({ id: 'person.photo' }),
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Avatar alt='studentpicture' src={params.row.student_picture} />
      )
    },
    {
      field: 'name',
      headerName: intl.translate({ id: 'person.name' }),
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'second_name',
      headerName: intl.translate({ id: 'person.secondname' }),
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'last_name',
      headerName: intl.translate({ id: 'person.lastname' }),
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'birth_date',
      headerName: intl.translate({ id: 'date_of_birth' }),
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) =>
        params.row.birth_date != null ? format(new Date(params.row.birth_date), 'P') : ''
    },
    {
      field: 'gender',
      headerAlign: 'center',
      align: 'center',
      headerName: intl.translate({ id: 'gender' }),
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        params.row.gender == 'MALE'
          ? intl.translate({ id: 'person.male' })
          : params.row.gender == 'FEMAIL'
          ? intl.translate({ id: 'person.female' })
          : params.row.gender == 'OTHER'
          ? intl.translate({ id: 'other' })
          : ''
    },
    {
      field: 'graduation_period',
      headerAlign: 'center',
      align: 'center',
      headerName: intl.translate({ id: 'person.graduation_period' }),
      flex: 1
    },
    {
      field: 'graduation_status',
      headerAlign: 'center',
      align: 'center',
      headerName: intl.translate({ id: 'person.graduation_status' }),
      flex: 2
    },
    {
      field: 'education_status',
      headerAlign: 'center',
      align: 'center',
      headerName: intl.translate({ id: 'person.school' }),
      flex: 2,
      renderCell: (params: GridValueGetterParams) =>
        params.row.education_status == 'gkv_primary'
          ? 'GAZİANTEP KOLEJ VAKFI ÖZEL İLKOKULU'
          : params.row.education_status == 'gkv_secondary'
          ? 'GAZİANTEP KOLEJ VAKFI ÖZEL ORTAOKULU'
          : params.row.education_status == 'gkv_anatolian_high_school'
          ? 'GAZİANTEP KOLEJ VAKFI ÖZEL ANADOLU LİSESİ'
          : params.row.education_status == 'gkv_science_high_school'
          ? 'GAZİANTEP KOLEJ VAKFI ÖZEL FEN LİSESİ'
          : params.row.education_status == 'gkv_cemil_alevli_college'
          ? 'GAZİANTEP KOLEJ VAKFI ÖZEL OKULLARI CEMİL ALEVLİ KOLEJİ'
          : ''
    },
    {
      field: 'phone_number',
      align: 'center',
      headerName: intl.translate({ id: 'user.phone_number' }),
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'email',
      headerName: intl.translate({ id: 'person.email' }),
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'id',
      headerAlign: 'center',
      headerName: intl.translate({ id: 'app.actions' }),
      width: mobileDevice ? 100 : 150,
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <RowActions
          params={params}
          onEditClick={() => navigate(`/persons/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/persons/${params.row.id}/delete`)}
          onShowClick={
            mobileDevice ? null : () => navigate(`/persons/person-page/${params.row.id}`)
          }
        />
      )
    }
  ];

  const handleDeleteConfirm = () => {
    deletePerson(id);
  };

  const handleCloseConfirm = React.useCallback(() => {
    navigate('/persons');
    setShowConfirmDialog(false);
  }, [navigate]);

  React.useEffect(() => {
    pullPersons();
  }, []);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted = persons && persons.length && persons.findIndex((g) => g.id === id);
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, persons, showConfirmDialog, setShowConfirmDialog, handleCloseConfirm]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'person.alumni_students', url: '/persons' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={transStudents}>
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
            title={transStudents}
            action={
              <Button
                onClick={() => navigate(`/persons/new`)}
                startIcon={<FontAwesomeIcon icon={faPlus} fontSize={10} />}
              >
                {intl.translate({ id: 'student.add' })}
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
                rows={persons}
                columns={columns}
                components={{ Toolbar: GridToolbarQuickFilter }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 }
                  }
                }}
              />
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>

      {action === 'edit' && (
        <AppDialog
          title={intl.formatMessage({ id: 'app.edit' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/persons')}
        >
          <PersonForm actionType={action} handleClose={() => navigate('/persons')} />
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

export default connector(ListPerson);
