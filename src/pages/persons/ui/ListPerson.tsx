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
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import RowActions from 'components/table/RowActions';
import ConfirmDialog from 'components/ConfirmDialog';
import SchoostDialog from 'components/SchoostDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-duotone-svg-icons';
import { GridColDef, LicenseInfo, DataGridPro, GridValueGetterParams } from '@mui/x-data-grid-pro';
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
  const transStudents = intl.translate({ id: 'school.students' });

  const columns: GridColDef[] = [
    { field: 'student_picture', headerName: intl.translate({ id: 'person.photo' }), flex: 1 },
    { field: 'name', headerName: intl.translate({ id: 'person.name' }), flex: 2 },
    { field: 'second_name', headerName: intl.translate({ id: 'person.secondname' }), flex: 2 },
    { field: 'last_name', headerName: intl.translate({ id: 'person.lastname' }), flex: 2 },
    { field: 'ssn_number', headerName: intl.translate({ id: 'id_number' }), flex: 2 },
    { field: 'school_number', headerName: intl.translate({ id: 'student.no' }), flex: 1 },
    {
      field: 'birth_date',
      headerName: intl.translate({ id: 'date_of_birth' }),
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        params.row.birth_date != null ? format(new Date(params.row.birth_date), 'P') : ''
    },
    {
      field: 'gender',
      headerName: intl.translate({ id: 'gender' }),
      flex: 1,
      renderCell: (params: GridValueGetterParams) =>
        params.row.gender == 'MALE'
          ? intl.translate({ id: 'person.male' })
          : params.row.gender == 'FEMALE'
          ? intl.translate({ id: 'person.female' })
          : params.row.gender == 'OTHER'
          ? intl.translate({ id: 'other' })
          : ''
    },
    { field: 'occupation', headerName: intl.translate({ id: 'person.occupation' }), flex: 1 },
    {
      field: 'graduation_period',
      headerName: intl.translate({ id: 'person.graduation_period' }),
      flex: 1
    },
    {
      field: 'graduation_status',
      headerName: intl.translate({ id: 'person.graduation_status' }),
      flex: 1
    },
    {
      field: 'education_status',
      headerName: intl.translate({ id: 'person.education_status' }),
      flex: 1
    },
    { field: 'phone_number', headerName: intl.translate({ id: 'user.phone_number' }), flex: 1 },
    { field: 'email', headerName: intl.translate({ id: 'person.email' }), flex: 1 },
    { field: 'linkedin_url', headerName: intl.translate({ id: 'person.linkedin' }), flex: 1 },
    { field: 'twitter_url', headerName: intl.translate({ id: 'person.twitter' }), flex: 1 },
    { field: 'facebook_url', headerName: intl.translate({ id: 'person.facebook' }), flex: 1 },
    {
      field: 'id',
      headerName: intl.translate({ id: 'app.actions' }),
      width: mobileDevice ? 100 : 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <RowActions
          params={params}
          onEditClick={() => navigate(`/persons/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/persons/${params.row.id}/delete`)}
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
    breadcrumbs.push({ title: 'school.students', url: '/persons' });
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
          handleClose={() => navigate('/persons')}
        >
          <PersonForm actionType={action} handleClose={() => navigate('/persons')} />
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

export default connector(ListPerson);
