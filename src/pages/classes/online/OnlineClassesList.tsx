import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Box, CardHeader, Grid, IconButton, useMediaQuery, useTheme } from '@mui/material';

import { GridColDef, GridValueGetterParams, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faVideo, faVideoPlus } from '@fortawesome/pro-duotone-svg-icons';
import { format, isPast, isToday, isFuture } from 'date-fns';

import Page from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';
import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'store/user';
import useTranslation from 'hooks/useTranslation';
import SchoostDialog from 'components/SchoostDialog';
import RowActions from 'components/table/RowActions';
import Filter, { IFilter, IFilterOptions } from 'components/filter/Filter';
import SideForm from 'components/SideForm';
import ConfirmDialog from 'components/ConfirmDialog';
import SplitButton from 'components/SplitButton';
import { TActionType } from 'utils/shared-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { IBreadcrumb } from 'pages/admin/menu-types';

import { onlineClassesActions, onlineClassesDataSelector } from './_store/onlineClasses';
import OnlineClassForm from './OnlineClassForm';
import OnlineClassCard from './OnlineClassCard';
import JoinOnlineClass from './JoinOnlineClass';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  onlineClassesData: onlineClassesDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullOnlineClasss: (page: number, school: Partial<ISchool>, season: ISeason) =>
    dispatch(onlineClassesActions.pullOnlineClasss(page, school, season)),
  deleteOnlineClass: (id: number) => dispatch(onlineClassesActions.deleteOnlineClass(id)),
  setFilters: (filters: IFilter[]) => dispatch(onlineClassesActions.setFilters(filters))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TProps = PropsFromRedux;

const OnlineClasses = (props: TProps) => {
  const {
    onlineClassesData,
    activeSchool,
    activeSeason,
    pullOnlineClasss,
    deleteOnlineClass,
    setFilters
  } = props;
  const { onlineClasses, filters, phase } = onlineClassesData;
  const { id, action } = useParams();
  const [page] = React.useState<number>(1);
  const intl = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [mode, setMode] = React.useState<string>('grid');
  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));

  // Use a new variable for online classes
  let oClasses = onlineClasses;

  // Apply user filters
  filters?.forEach((f) => {
    if (f.id === 'date:upcoming') {
      oClasses = oClasses.filter((c) => isFuture(new Date(c.endsAt)));
    }
    if (f.id === 'date:today') {
      oClasses = oClasses.filter((c) => isToday(new Date(c.endsAt)));
    }
    if (f.id === 'date:past') {
      oClasses = oClasses.filter((c) => isPast(new Date(c.endsAt)));
    }
    if (f.id.includes('search')) {
      oClasses = oClasses.filter(
        (c) =>
          c.title.toLowerCase().includes(f.title.toLowerCase()) ||
          c?.description.toLowerCase().includes(f.title.toLowerCase())
      );
    }
  });

  // Translations
  const transClasses = intl.translate({ id: 'online.classes' });
  const transClassesList = intl.translate({ id: 'online.classes.list' });
  const transShowing = intl.translate(
    { id: 'app.showing.count' },
    { count: oClasses?.length || 0 }
  );
  const transClass = intl.translate({ id: 'online.class' });
  const transEdit = intl.translate({ id: 'app.edit.something' }, { something: transClass });
  const transDelete = intl.translate({ id: 'app.delete.something' }, { something: transClass });

  const langPack = {
    transJoinAsTeacher: intl.translate({ id: 'online.class.join.as.teacher' }),
    transJoinAsStudent: intl.translate({ id: 'online.class.join.as.student' }),
    transPlayRecording: intl.translate({ id: 'online.class.play.recording' }),
    transClassOver: intl.translate({ id: 'online.class.ended' })
  };

  const pageTitle =
    (action === 'edit' && transEdit) || (action === 'delete' && transDelete) || transClassesList;

  const columns: GridColDef[] = [
    { field: 'title', headerName: intl.translate({ id: 'online.class.title' }), flex: 2 },
    {
      field: 'startsAt',
      headerName: intl.translate({ id: 'app.date.start.datetime' }),
      flex: 2,
      renderCell: (params: GridValueGetterParams) => format(new Date(params.row.startsAt), 'Pp')
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
          onEditClick={() => navigate(`/classes/online/${params.row.id}/edit`)}
        />
      )
    }
  ];

  const filterOptions: IFilterOptions[] = [
    {
      label: intl.translate({ id: 'app.date' }),
      filters: [
        { id: 'date:upcoming', title: intl.translate({ id: 'app.date.upcoming' }) },
        { id: 'date:today', title: intl.translate({ id: 'app.date.today' }) },
        { id: 'date:past', title: intl.translate({ id: 'app.date.past' }) }
      ]
    }
  ];

  const handleDeleteConfirm = () => {
    deleteOnlineClass(parseInt(id));
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
    navigate('/classes/online');
  };

  React.useEffect(() => {
    pullOnlineClasss(page, activeSchool, activeSeason);
  }, [page, activeSchool, activeSeason]);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    const isDeleted =
      oClasses && oClasses.length && oClasses.findIndex((g) => g.id === parseInt(id));
    if (isDeleted === -1 && showConfirmDialog) {
      handleCloseConfirm();
    }
  }, [id, action, phase, oClasses, showConfirmDialog, setShowConfirmDialog]);

  React.useEffect(() => {
    if (filters.length === 0) {
      setFilters([{ id: 'date:today', title: intl.translate({ id: 'app.date.today' }) }]);
    }
  }, []);

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transClasses, url: '/classes/online', original: true });
    breadcrumbs.push({ title: transClassesList, url: '/classes/online', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={pageTitle}>
      <Filter
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
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
            <SplitButton
              title='add online class'
              variant='text'
              options={[
                {
                  id: 'add-online',
                  title: intl.translate({ id: 'app.add.something' }, { something: transClass }),
                  icon: <FontAwesomeIcon icon={faVideoPlus} />,
                  handleOptionClick: () => navigate(`/classes/online/new`)
                },
                {
                  id: 'add-immediate-online',
                  title: intl.translate({ id: 'online.class.add.start' }),
                  icon: <FontAwesomeIcon icon={faVideo} />,
                  handleOptionClick: () => navigate(`/classes/online/start`)
                }
              ]}
            />
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
            rows={oClasses || []}
            columns={columns}
          />
          {id && !action && (
            <SideForm handleClickClose={() => navigate('/classes/online')}>
              <OnlineClassForm
                sideForm={true}
                actionType='show'
                handleClose={() => navigate('/classes/online')}
              />
            </SideForm>
          )}
        </Box>
      )) || (
        <Box sx={{ display: 'flex', p: 2, width: '100%', bgcolor: 'background.paper' }}>
          <Grid container spacing={2}>
            {oClasses?.map((classs) => {
              return (
                <Grid key={classs.id} item xs={12} sm={6} md={4}>
                  <OnlineClassCard classs={classs} langPack={langPack} />
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
          handleClose={() => navigate('/classes/online')}
        >
          <OnlineClassForm actionType={action} handleClose={() => navigate('/classes/online')} />
        </SchoostDialog>
      )}

      {/* Edit Dialog */}
      <SchoostDialog
        title={intl.formatMessage({ id: 'app.edit' })}
        isOpen={action === 'edit'}
        dividers={true}
        handleClose={() => navigate('/classes/online')}
      >
        <OnlineClassForm
          actionType={action as TActionType}
          handleClose={() => navigate('/classes/online')}
        />
      </SchoostDialog>

      {/* Join Dialog */}
      <SchoostDialog isOpen={action === 'join'} handleClose={() => navigate('/classes/online')}>
        <JoinOnlineClass handleClose={() => navigate('/classes/online')} />
      </SchoostDialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
        phase={phase}
      />
    </Page>
  );
};

export default connector(OnlineClasses);
