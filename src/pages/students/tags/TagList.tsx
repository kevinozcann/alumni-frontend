import React, { useCallback } from 'react';
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
import Scrollbar from 'layout/Scrollbar';
import { useSubheader } from 'contexts/SubheaderContext';
import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector } from 'pages/profile/services/user';
import useTranslation from 'hooks/useTranslation';
import SchoostDialog from 'components/SchoostDialog';
import SideForm from 'components/SideForm';
import ConfirmDialog from 'components/ConfirmDialog';
import RowActions from 'components/table/RowActions';
import { ISchool } from 'pages/organization/organization-types';

import StudentTagsForm from './StudentTagsForm';
import { studentTagsActions, studentTagsPhaseSelector, studentTagsSelector } from './_store/tags';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  studentTags: studentTagsSelector(state),
  phase: studentTagsPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullStudentTags: (school: ISchool) => dispatch(studentTagsActions.pullStudentTags(school)),
  deleteStudentTag: (id: number) => dispatch(studentTagsActions.deleteStudentTag(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TStudentTagsProps = PropsFromRedux;

const TagList: React.FC<TStudentTagsProps> = (props) => {
  const { studentTags, phase, activeSchool, pullStudentTags, deleteStudentTag } = props;
  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const { id, action } = useParams();

  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));

  const transStudentTag = intl.translate({ id: 'student.tag' });
  const transStudentTags = intl.translate({ id: 'student.tags' });

  const columns: GridColDef[] = [
    { field: 'tag', headerName: intl.translate({ id: 'student.tag.tag' }), flex: 2 },
    {
      field: 'hit',
      headerName: intl.translate({ id: 'student.tag.hit' }),
      flex: 1,
      hide: mobileDevice ? true : false
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
          onEditClick={() => navigate(`/student/tags/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/student/tags/${params.row.id}/delete`)}
          onShowClick={mobileDevice ? null : () => navigate(`/student/tags/${params.row.id}`)}
        />
      )
    }
  ];

  const handleDeleteConfirm = () => {
    deleteStudentTag(parseInt(id));
  };

  const handleCloseConfirm = useCallback(() => {
    navigate('/student/tags');
    setShowConfirmDialog(false);
  }, [navigate]);

  React.useEffect(() => {
    pullStudentTags(activeSchool);
  }, [activeSchool, pullStudentTags]);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      studentTags && studentTags.length && studentTags.findIndex((g) => g.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, studentTags, showConfirmDialog, setShowConfirmDialog, handleCloseConfirm]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'student.tags', url: '/student/tags' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, [subheader]);

  return (
    <Page title={transStudentTags}>
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
            title={transStudentTags}
            action={
              <Button
                onClick={() => navigate(`/student/tags/new`)}
                startIcon={<FontAwesomeIcon icon={faPlus} fontSize={10} />}
              >
                {intl.translate({ id: 'app.add.something' }, { something: transStudentTag })}
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
                rows={studentTags}
                columns={columns}
              />
              {id && !action && (
                <SideForm handleClickClose={() => navigate('/student/tags')}>
                  <StudentTagsForm
                    sideForm={true}
                    actionType='show'
                    handleClose={() => navigate('/student/tags')}
                  />
                </SideForm>
              )}
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>

      {action === 'edit' && (
        <SchoostDialog
          title={intl.formatMessage({ id: 'app.edit' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/student/tags')}
        >
          <StudentTagsForm actionType={action} handleClose={() => navigate('/student/tags')} />
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

export default connector(TagList);
