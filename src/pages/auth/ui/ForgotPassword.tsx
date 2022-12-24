import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/pro-duotone-svg-icons';

import Login from 'components/links/Login';
import { AppDispatch, RootState } from 'store/store';
import { authErrorSelector, authPhaseSelector } from 'pages/auth/services/auth';
import { i18nLangSelector } from 'store/i18n';
import { TLang } from 'utils/shared-types';
import { authActions } from '../services/actions';
import { actionPhases } from '../services/types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  authPhase: authPhaseSelector(state),
  authError: authErrorSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setPhase: (phase: string) => dispatch(authActions.setPhase(phase, null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TForgotPasswordProps = PropsFromRedux;

interface IFormValues {
  email: string;
}

const ForgotPassword: React.FC<TForgotPasswordProps> = (props) => {
  const { lang, authPhase, authError, setPhase } = props;
  const [alert, setAlert] = React.useState<string>(null);
  const intl = useIntl();

  const formInitialValues: IFormValues = {
    email: ''
  };

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting, setSubmitting } =
    useFormik({
      initialValues: formInitialValues,
      validate: (values) => validateForm(values),
      onSubmit: (values) => submitForm(values)
    });

  const validateForm = (values: Partial<IFormValues>) => {
    const errors = {};

    if (values.email === '') {
      errors['email'] = intl.formatMessage({ id: 'error.cannot_be_empty' });

      return errors;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors['email'] = intl.formatMessage({ id: 'error.invalid_input' });
    }

    return errors;
  };

  const submitForm = (values: IFormValues) => {
    setSubmitting(true);
    // sendUserPasswordLink(values.email, lang);
  };

  React.useEffect(() => {
    if (isSubmitting) {
      setAlert(null);
    }
  }, [isSubmitting]);

  React.useEffect(() => {
    if (authPhase === actionPhases.PASSWORD_LINK_SENDING_SUCCESSFUL) {
      setAlert(intl.formatMessage({ id: 'login.forgot_password.link_sent' }));
      setSubmitting(false);
    }
  }, [authPhase]);

  React.useEffect(() => {
    if (authPhase === actionPhases.PASSWORD_LINK_SENDING_ERROR) {
      const name = intl.formatMessage({ id: 'user.email_address.no_override' });
      if (authError === 'email_is_empty') {
        setAlert(intl.formatMessage({ id: 'app.cannot_be_empty_w_name' }, { name: name }));
      } else if (authError === 'email_not_found') {
        setAlert(intl.formatMessage({ id: 'login.forgot_password.email_not_found' }));
      } else {
        setAlert(intl.formatMessage({ id: 'app.error' }));
      }
      setSubmitting(false);
    }
    // } else if (authPhase != actionPhases.PASSWORD_LINK_SENDING_ERROR) {
    //   setPhase(null);
    //   setAlert(null);
    // }
  }, [authPhase]);

  // Set submitting false by default
  React.useEffect(() => {
    setSubmitting(false);
    setAlert(null);
    setPhase(null);
  }, []);

  return (
    <React.Fragment>
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
          <Box
            sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography color='textPrimary' gutterBottom variant='h4'>
              {intl.formatMessage({ id: 'login.forgot_password' })}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ mb: 2 }} variant='body1'>
              {intl.formatMessage({ id: 'login.forgot_password.explanation' })}
            </Typography>

            <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
              <TextField
                className=''
                disabled={isSubmitting}
                fullWidth={true}
                id='email'
                label={intl.formatMessage({ id: 'user.email_address.no_override' })}
                placeholder={intl.formatMessage({ id: 'user.email_address.no_override' })}
                margin='normal'
                value={values.email}
                onChange={handleChange}
                variant='outlined'
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              {alert && (
                <Box sx={{ mt: 1 }}>
                  <Alert
                    variant='outlined'
                    severity='error'
                    closeText={intl.formatMessage({ id: 'app.close' })}
                    onClose={() => setAlert(null)}
                  >
                    {alert}
                  </Alert>
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Button
                  color='primary'
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  startIcon={
                    (isSubmitting && <FontAwesomeIcon icon={faSpinner} spin={true} />) || (
                      <FontAwesomeIcon icon={faPaperPlane} />
                    )
                  }
                  disabled={isSubmitting}
                >
                  {(isSubmitting && intl.formatMessage({ id: 'app.sending' })) ||
                    intl.formatMessage({ id: 'app.send' })}
                </Button>
              </Box>
            </form>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              flexGrow: 1,
              textAlign: 'center'
            }}
          >
            <Login />
          </Box>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default connector(ForgotPassword);
