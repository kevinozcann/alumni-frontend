import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GridColDef, GridValueGetterParams, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faThLarge, faTrash } from '@fortawesome/pro-duotone-svg-icons';

import Page from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';
import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'store/user';
import useTranslation from 'hooks/useTranslation';
import getInitials from 'utils/getInitials';
import StyledMenu from 'utils/StyledMenu';
import SchoostDialog from 'components/SchoostDialog';
import SideForm from 'components/SideForm';
import ConfirmDialog from 'components/ConfirmDialog';
import RowActions from 'components/table/RowActions';
import Filter from 'components/filter/Filter';
import { ISchool } from 'pages/organization/organization-types';
import { IBreadcrumb } from 'pages/admin/menu-types';

import { classesActions, classesDataSelector } from './_store/classes';
import ClassForm from './ClassForm';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  classesData: classesDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullClasses: (school: Partial<ISchool>) => dispatch(classesActions.pullClasses(school)),
  deleteClass: (id: number) => dispatch(classesActions.deleteClass(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TStudentTagsProps = PropsFromRedux;

const ClassesList = (props: TStudentTagsProps) => {
  const { classesData, activeSchool, activeSeason, pullClasses, deleteClass } = props;
  const { classes, phase } = classesData;
  const { id, action } = useParams();
  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [mode, setMode] = React.useState<string>('grid');
  const [anchorAmEl, setAnchorAmEl] = React.useState<null | HTMLElement>(null);
  const isAmOpen = Boolean(anchorAmEl);
  const ITEM_HEIGHT = 48;

  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));

  const transClasses = intl.translate({ id: 'classes' });
  const transClassesList = intl.translate({ id: 'classes.list' });
  const transShowing = intl.translate({ id: 'app.showing.count' }, { count: classes?.length || 0 });
  const transClass = intl.translate({ id: 'class' });
  const transEdit = intl.translate({ id: 'app.edit.something' }, { something: transClass });
  const transDelete = intl.translate({ id: 'app.delete.something' }, { something: transClass });

  const pageTitle =
    (action === 'edit' && transEdit) || (action === 'delete' && transDelete) || transClassesList;

  const columns: GridColDef[] = [
    { field: 'title', headerName: intl.translate({ id: 'class.title' }), flex: 1 },
    {
      field: 'id',
      headerName: intl.translate({ id: 'app.actions' }),
      width: mobileDevice ? 100 : 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridValueGetterParams) => (
        <RowActions
          params={params}
          onEditClick={() => navigate(`/classes/classes/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/classes/classes/${params.row.id}/delete`)}
          onShowClick={mobileDevice ? null : () => navigate(`/classes/classes/${params.row.id}`)}
        />
      )
    }
  ];

  const handleDeleteConfirm = () => {
    deleteClass(parseInt(id));
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
    navigate('/classes/classes');
  };

  const handleActionsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAmEl(event.currentTarget);
  };
  const handleActionsMenuClose = () => {
    setAnchorAmEl(null);
  };

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted = classes && classes.length && classes.findIndex((p) => p.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, classesData]);

  React.useEffect(() => {
    pullClasses(activeSchool);
  }, [activeSchool, activeSeason]);

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transClasses, url: '/classes', original: true });
    breadcrumbs.push({ title: transClassesList, url: '/classes/classes', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={pageTitle}>
      <Filter
        filters={[]}
        setFilters={() => console.log('here')}
        filterOptions={[]}
        filterChecks={[]}
      />

      <Box sx={{ m: 3 }} />

      <CardHeader
        sx={{
          p: 1,
          position: 'relative',
          '& .MuiCardHeader-content': {
            '& span': {
              mx: '-8px'
            },
            '&:after': {
              backgroundColor: 'primary.main',
              bottom: '4px',
              content: '" "',
              height: '3px',
              left: 0,
              position: 'absolute',
              width: '48px'
            }
          }
        }}
        title={transShowing}
        action={
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Button
              onClick={() => navigate(`/classes/classes/new`)}
              startIcon={<FontAwesomeIcon icon={faPlus} />}
            >
              {intl.translate({ id: 'app.add.something' }, { something: transClass })}
            </Button>
            <IconButton
              color={(mode === 'grid' && 'primary') || 'default'}
              onClick={() => setMode((mode === 'table' && 'grid') || 'table')}
            >
              <FontAwesomeIcon icon={faThLarge} />
            </IconButton>
          </Box>
        }
      />

      {(mode === 'table' && (
        <Box sx={{ display: 'flex', height: 550, width: '100%', bgcolor: 'background.paper' }}>
          <DataGridPro
            pagination
            pageSize={10}
            rowsPerPageOptions={[5, 10, 50]}
            loading={phase === 'loading'}
            rows={classes || []}
            columns={columns}
          />
          {id && !action && (
            <SideForm handleClickClose={() => navigate('/classes/classes')}>
              <ClassForm
                sideForm={true}
                actionType='show'
                handleClose={() => navigate('/classes/classes')}
              />
            </SideForm>
          )}
        </Box>
      )) || (
        <Box sx={{ display: 'flex', p: 2, width: '100%', bgcolor: 'background.paper' }}>
          <Grid container spacing={2}>
            {classes?.map((classs) => {
              return (
                <Grid key={classs.id} item xs={12} sm={6} md={4}>
                  <Card>
                    <CardHeader
                      avatar={<Avatar aria-label='avatar'>{getInitials(`${classs.title}`)}</Avatar>}
                      title={`${classs.title}`}
                      // subheader={class.emailAddress}
                      action={
                        <Box sx={{ display: 'flex' }}>
                          <IconButton
                            id='class-edit'
                            aria-label='edit'
                            title={intl.formatMessage({ id: 'app.edit' })}
                            size='large'
                            onClick={() => navigate(`/classes/classes/${classs.id}/edit`)}
                          >
                            <EditIcon color='primary' />
                          </IconButton>
                          <IconButton
                            id='class-more'
                            aria-label='more'
                            size='large'
                            aria-expanded={isAmOpen ? 'true' : undefined}
                            aria-haspopup='true'
                            onClick={handleActionsMenuClick}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <StyledMenu
                            id='class-more-menu'
                            MenuListProps={{
                              'aria-labelledby': 'class-more-menu'
                            }}
                            anchorEl={anchorAmEl}
                            open={isAmOpen}
                            onClose={handleActionsMenuClose}
                            PaperProps={{
                              style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch'
                              }
                            }}
                          >
                            <MenuItem
                              key='class-delete'
                              onClick={() => {
                                setAnchorAmEl(null);
                                navigate(`/classes/classes/${classs.id}/delete`);
                              }}
                              disableRipple
                            >
                              <FontAwesomeIcon icon={faTrash} color='red' />
                              {intl.translate({ id: 'app.delete' })}
                            </MenuItem>
                          </StyledMenu>
                        </Box>
                      }
                    />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {action === 'edit' && (
        <SchoostDialog
          title={intl.formatMessage({ id: 'app.edit' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/classes/classes')}
        >
          <ClassForm actionType={action} handleClose={() => navigate('/classes/classes')} />
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

export default connector(ClassesList);
