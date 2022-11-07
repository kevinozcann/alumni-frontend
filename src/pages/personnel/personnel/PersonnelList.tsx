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
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red, blue, grey } from '@mui/material/colors';
import { GridColDef, GridValueGetterParams, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMobile, faThLarge, faTrash } from '@fortawesome/pro-duotone-svg-icons';

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
import { IBreadcrumb } from 'pages/admin/menus/menu-types';

import { personnelActions, personnelDataSelector } from './_store/personnel';
import PersonnelForm from './PersonnelForm';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  personnelData: personnelDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullPersonnel: (school: Partial<ISchool>) => dispatch(personnelActions.pullPersonnel(school)),
  deletePerson: (id: number) => dispatch(personnelActions.deletePerson(id))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TStudentTagsProps = PropsFromRedux;

const PersonnelList = (props: TStudentTagsProps) => {
  const { personnelData, activeSchool, activeSeason, pullPersonnel, deletePerson } = props;
  const { personnel, phase } = personnelData;
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

  const transPersonnel = intl.translate({ id: 'personnel' });
  const transPersonnelList = intl.translate({ id: 'personnel.list' });
  const transShowing = intl.translate(
    { id: 'app.showing.count' },
    { count: personnel?.length || 0 }
  );
  const transPerson = intl.translate({ id: 'person' });
  const transEdit = intl.translate({ id: 'app.edit.something' }, { something: transPerson });
  const transDelete = intl.translate({ id: 'app.delete.something' }, { something: transPerson });

  const pageTitle =
    (action === 'edit' && transEdit) || (action === 'delete' && transDelete) || transPersonnelList;

  const columns: GridColDef[] = [
    { field: 'name', headerName: intl.translate({ id: 'person.name' }), flex: 1 },
    {
      field: 'lastname',
      headerName: intl.translate({ id: 'person.lastname' }),
      flex: 1
    },
    {
      field: 'mobile',
      headerName: intl.translate({ id: 'person.mobile' }),
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Stack direction='row' spacing={1}>
          <div>
            <FontAwesomeIcon icon={faMobile} />
          </div>
          <div>{params.row.mobile}</div>
        </Stack>
      )
    },
    {
      field: 'emailAddress',
      headerName: intl.translate({ id: 'person.email' }),
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
          onEditClick={() => navigate(`/personnel/personnel/${params.row.id}/edit`)}
          onDeleteClick={() => navigate(`/personnel/personnel/${params.row.id}/delete`)}
          onShowClick={
            mobileDevice ? null : () => navigate(`/personnel/personnel/${params.row.id}`)
          }
        />
      )
    }
  ];

  const handleDeleteConfirm = () => {
    deletePerson(parseInt(id));
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
    navigate('/personnel/personnel');
  };

  const handleActionsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAmEl(event.currentTarget);
  };
  const handleActionsMenuClose = () => {
    setAnchorAmEl(null);
  };

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      personnel && personnel.length && personnel.findIndex((p) => p.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, personnelData]);

  React.useEffect(() => {
    pullPersonnel(activeSchool);
  }, [activeSchool, activeSeason]);

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transPersonnel, url: '/personnel', original: true });
    breadcrumbs.push({ title: transPersonnelList, url: '/personnel/personnel', original: true });
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
              onClick={() => navigate(`/personnel/personnel/new`)}
              startIcon={<FontAwesomeIcon icon={faPlus} />}
            >
              {intl.translate({ id: 'app.add.something' }, { something: transPerson })}
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
            rows={personnel || []}
            columns={columns}
          />
          {id && !action && (
            <SideForm handleClickClose={() => navigate('/personnel/personnel')}>
              <PersonnelForm
                sideForm={true}
                actionType='show'
                handleClose={() => navigate('/personnel/personnel')}
              />
            </SideForm>
          )}
        </Box>
      )) || (
        <Box sx={{ display: 'flex', p: 2, width: '100%', bgcolor: 'background.paper' }}>
          <Grid container spacing={2}>
            {personnel?.map((person) => {
              return (
                <Grid key={person.id} item xs={12} sm={6} md={4}>
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor:
                              (person.gender === 'E' && blue[500]) ||
                              (person.gender === 'K' && red[400]) ||
                              grey[400]
                          }}
                          src={person?.photo || null}
                          aria-label='avatar'
                        >
                          {getInitials(`${person.name} ${person.lastname}`)}
                        </Avatar>
                      }
                      title={`${person.name} ${person.lastname}`}
                      subheader={person.emailAddress}
                      action={
                        <Box sx={{ display: 'flex' }}>
                          <IconButton
                            id='person-edit'
                            aria-label='edit'
                            title={intl.formatMessage({ id: 'app.edit' })}
                            size='large'
                            onClick={() => navigate(`/personnel/personnel/${person.id}/edit`)}
                          >
                            <EditIcon color='primary' />
                          </IconButton>
                          <IconButton
                            id='person-more'
                            aria-label='more'
                            size='large'
                            aria-expanded={isAmOpen ? 'true' : undefined}
                            aria-haspopup='true'
                            onClick={handleActionsMenuClick}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <StyledMenu
                            id='person-more-menu'
                            MenuListProps={{
                              'aria-labelledby': 'person-more-menu'
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
                              key='person-delete'
                              onClick={() => {
                                setAnchorAmEl(null);
                                navigate(`/personnel/personnel/${person.id}/delete`);
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
          handleClose={() => navigate('/personnel/personnel')}
        >
          <PersonnelForm actionType={action} handleClose={() => navigate('/personnel/personnel')} />
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

export default connector(PersonnelList);
