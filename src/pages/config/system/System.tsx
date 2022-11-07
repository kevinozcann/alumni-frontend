import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider
  // useMediaQuery,
  // useTheme
} from '@mui/material';
import { LicenseInfo } from '@mui/x-data-grid-pro';
// import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { useSubheader } from '../../../contexts/SubheaderContext';
import Page from '../../../layout/Page';
import Scrollbar from '../../../layout/Scrollbar';
import { AppDispatch, RootState } from '../../../store/store';
import { configActions, configPhaseSelector, systemConfigSelector } from '../../../store/config';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { AddFabButton } from '../../../utils/ActionLinks';
import { i18nLangSelector } from 'store/i18n';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  systemConfig: systemConfigSelector(state),
  phase: configPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullConfiguration: () => dispatch(configActions.pullConfiguration())
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TGradeLevelsProps = PropsFromRedux;

const System: React.FC<TGradeLevelsProps> = (props) => {
  const { phase, pullConfiguration } = props;
  const { id, action } = useParams();
  const intl = useIntl();
  // const theme = useTheme();
  const navigate = useNavigate();
  const subheader = useSubheader();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  // const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const pageTitle = intl.formatMessage({ id: 'config.system' });

  const handleCloseConfirm = () => {
    navigate('/config/grade-levels');
    setShowConfirmDialog(false);
  };

  React.useEffect(() => {
    pullConfiguration();
  }, []);

  React.useEffect(() => {
    setShowConfirmDialog(id && action === 'delete' ? true : false);

    // const isDeleted =
    //   gradeLevels && gradeLevels.length && gradeLevels.findIndex((g) => g.id === parseInt(id));
    // if (isDeleted === -1 && showConfirmDialog) {
    //   handleCloseConfirm();
    // }
  }, [id, action, phase, showConfirmDialog, setShowConfirmDialog]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'config', url: '/config' });
    breadcrumbs.push({ title: 'config.system', url: '/config/system' });
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
              {/* {id && !action && (
                <SideForm handleClickClose={() => navigate('/config/grade-levels')}>
                  <GradeLevelsForm
                    sideForm={true}
                    actionType='show'
                    handleClose={() => navigate('/config/grade-levels')}
                  />
                </SideForm>
              )} */}
            </CardContent>
          </Scrollbar>
        </Card>
      </Box>

      <AddFabButton title='app.add' onClick={() => navigate(`/config/grade-levels/new`)} />

      {/* {action === 'edit' && (
        <SchoostDialog
          title={intl.formatMessage({ id: 'app.add' })}
          isOpen={true}
          dividers={true}
          handleClose={() => navigate('/config/grade-levels')}>
          <GradeLevelsForm
            actionType={action}
            handleClose={() => navigate('/config/grade-levels')}
          />
        </SchoostDialog>
      )} */}

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        // handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
        phase={phase}
      />
    </Page>
  );
};

export default connector(System);
