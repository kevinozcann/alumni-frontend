import React from 'react';
import { useIntl } from 'react-intl';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Card, CardHeader, CircularProgress, useMediaQuery, useTheme } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import {
  authActions,
  authImpersonateSelector,
  authPhaseSelector,
  authUserSelector
} from 'store/auth';
import { i18nLangSelector } from 'store/i18n';
import { IUser } from 'pages/account/account-types';
import { TLang } from 'utils/shared-types';
import { useNavigate } from 'react-router';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  impersonateUser: authImpersonateSelector(state),
  phase: authPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setPhase: (phase: string) => dispatch(authActions.setPhase(phase, null)),
  cancelImpersonate: (lang: TLang, currentUser: IUser, impersonateUser: IUser) =>
    dispatch(authActions.cancelImpersonate(lang, currentUser, impersonateUser))
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type TImpersonateBarProps = PropsFromRedux;

const ImpersonateBar: React.FC<TImpersonateBarProps> = (props) => {
  const { lang, user, impersonateUser, phase, setPhase, cancelImpersonate } = props;
  const [cancelInProgress, setCancelInProgress] = React.useState<boolean>(false);
  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();
  const desktopDevice = useMediaQuery(theme.breakpoints.up('sm'));

  const cancelImpersonation = () => {
    setCancelInProgress(true);
    cancelImpersonate(lang, user, impersonateUser);
  };

  React.useEffect(() => {
    if (phase === 'impersonate-cancel-successful') {
      navigate('/account/home');
    }
  }, [phase]);

  React.useEffect(() => {
    setPhase('');
  }, []);

  return impersonateUser ? (
    <Card
      sx={{
        backgroundColor: 'red',
        color: 'white',
        mt: 0,
        mb: 1,
        mx: (theme) => (desktopDevice && theme.spacing(3)) || theme.spacing(2),
        '& .MuiCardHeader-action': {
          alignSelf: 'center'
        }
      }}
    >
      <CardHeader
        title={intl.formatMessage(
          { id: 'account.impersonate.you_are_impersonating' },
          { name: user.fullName }
        )}
        action={
          <Button
            startIcon={
              (cancelInProgress && phase && phase.includes('ing') && (
                <CircularProgress size={18} />
              )) ||
              null
            }
            sx={{ color: 'white' }}
            onClick={() => cancelImpersonation()}
            variant='text'
          >
            {intl.formatMessage({
              id:
                (cancelInProgress && phase && phase.includes('ing') && 'app.processing') ||
                'app.cancel'
            })}
          </Button>
        }
      />
    </Card>
  ) : null;
};

export default connector(ImpersonateBar);
