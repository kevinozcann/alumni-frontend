import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { Box, Divider, Card, CardHeader, CardContent, Typography, Button } from '@mui/material';

import Page from 'layout/Page';
import { AppDispatch, RootState } from 'store/store';
import { authUserSelector } from 'store/auth';
import { i18nLangSelector } from 'store/i18n';
import { useSubheader } from 'contexts/SubheaderContext';
import ConfirmDialog from 'components/ConfirmDialog';
import { TLang } from 'utils/shared-types';

import { developerActions, developerDataSelector } from './_store/developer';
import useSnackbar from 'hooks/useSnackbar';
import { IUser } from 'pages/auth/data/account-types';
import HighlightCode from 'components/HighlightCode';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  developerData: developerDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  generateApiKey: (lang: TLang, user: IUser) =>
    dispatch(developerActions.generateApiKey(lang, user)),
  setPhase: (phase: string) => dispatch(developerActions.setPhase(phase, null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TApiKeyProps = PropsFromRedux;

const ApiKey = (props: TApiKeyProps) => {
  const { lang, user, developerData, generateApiKey, setPhase } = props;
  const { phase } = developerData;
  const [showConfirmDialog, setConfirmDialog] = React.useState<boolean>(false);
  const intl = useIntl();
  const subheader = useSubheader();
  const { showSnackbar } = useSnackbar();

  const handleGenerateConfirm = () => {
    generateApiKey(lang, user.attributes);
  };

  const handleCloseConfirm = () => {
    setConfirmDialog(false);
  };

  React.useEffect(() => {
    if (phase?.includes('successful')) {
      setConfirmDialog(false);

      showSnackbar({
        message: intl.formatMessage({ id: 'developer.generate.success' }),
        open: true
      });
    }
  }, [phase]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'developer', url: '/developer' });
    breadcrumbs.push({ title: 'developer.apikey', url: '/developer/apikey' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  React.useEffect(() => {
    setPhase(null);
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'developer.apikey' })}>
      <Box>
        <Card>
          <CardHeader title={intl.formatMessage({ id: 'developer.apikey' })} />
          <Divider />
          <CardContent>
            <HighlightCode language='html' textToCopy={user?.accessToken} styleTop='5px'>
              {`${user?.accessToken?.substring(0, 7)}.......................`}
            </HighlightCode>
          </CardContent>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Button sx={{ my: 1 }} variant='outlined' onClick={() => setConfirmDialog(true)}>
              {intl.formatMessage({ id: 'developer.generate' })}
            </Button>
            <Typography>{intl.formatMessage({ id: 'developer.generate.warning' })}</Typography>
          </Box>

          <ConfirmDialog
            handleClose={handleCloseConfirm}
            handleConfirm={handleGenerateConfirm}
            isOpen={showConfirmDialog}
            title={intl.formatMessage({ id: 'developer.generate' })}
            intro={`${intl.formatMessage({
              id: 'developer.generate.warning'
            })} ${intl.formatMessage({
              id: 'app.continue.questionmark'
            })}`}
            confirmBtnText={intl.formatMessage({ id: 'developer.generate' })}
            phase={phase}
          />
        </Card>
      </Box>
    </Page>
  );
};

export default connector(ApiKey);
