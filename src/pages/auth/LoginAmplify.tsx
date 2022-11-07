import React from 'react';
import { useNavigate } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

import {
  authActions,
  authPhaseSelector,
  authErrorSelector,
  authUserSelector,
  authAccessTokenSelector,
  loginPhases
} from 'store/auth';
import { i18nLangSelector } from 'store/i18n';
import { AppDispatch, RootState } from 'store/store';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import { TLang } from 'utils/shared-types';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  accessToken: authAccessTokenSelector(state),
  lang: i18nLangSelector(state),
  phase: authPhaseSelector(state),
  error: authErrorSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  userLogin(lang: TLang, email: string, pwd: string) {
    dispatch(authActions.login(lang, email, pwd));
  },
  setPhase(phase: loginPhases, error: string) {
    dispatch(authActions.setPhase(phase, error));
  }
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TLoginJWTProps = PropsFromRedux;

type FormValues = {
  email: string;
  password: string;
};

export const LoginJWT = (props: TLoginJWTProps) => {
  const { user, accessToken, lang, phase, error, userLogin, setPhase } = props;
  const [showAlert, setShowAlert] = React.useState(false);
  const { login } = useAuth();
  const intl = useTranslation();
  const navigate = useNavigate();

  const transEmail = intl.translate({ id: 'user.email_address' });
  const transPassword = intl.translate({ id: 'account.password' });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validate: (values: FormValues) => validateForm(values),
    onSubmit: (values: FormValues) => submitForm(values)
  });

  const validateForm = (values: Record<string, unknown>) => {
    const errors: { [key: string]: any } = {};

    if (!values.email) {
      errors.email = intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transEmail });
      // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    } else if (!/^[A-Z0-9._]+/i.test(`${values.email}`)) {
      //@TODO: check this for turkish chars
      errors.email = intl.translate({ id: 'user.user_id.invalid' });
    }

    if (!values.password) {
      errors.password = intl.translate(
        { id: 'app.cannot_be_empty_w_name' },
        { name: transPassword }
      );
    }

    return errors;
  };

  const submitForm = (values: FormValues) => {
    // Start login
    userLogin(lang, values.email, values.password);
  };

  React.useEffect(() => {
    setPhase(null, null);
  }, [setPhase]);

  React.useEffect(() => {
    setShowAlert(error ? true : false);
  }, [error]);

  React.useEffect(() => {
    if (accessToken && user && phase === 'login-successful') {
      // Login the user to the context
      login(accessToken, user);

      setTimeout(() => {
        navigate('/account/home');
      }, 500);
    }
  }, [accessToken, user, phase]);

  return (
    <Box>
      <Typography sx={{ mb: 2 }} variant='body1'>
        {intl.translate({ id: 'login.enter_email_password' })}
      </Typography>

      <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
        <TextField
          autoFocus
          fullWidth
          type='email'
          name='email'
          label={transEmail}
          margin='normal'
          variant='outlined'
          placeholder={transEmail}
          onChange={handleChange}
          value={values.email}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />

        <TextField
          fullWidth
          type='password'
          name='password'
          margin='normal'
          variant='outlined'
          label={transPassword}
          placeholder={transPassword}
          onChange={handleChange}
          value={values.password}
          error={Boolean(touched.password && errors.password)}
          helperText={touched.password && errors.password}
        />

        {showAlert && (
          <Box sx={{ mt: 2 }}>
            <Alert
              variant='outlined'
              severity='error'
              closeText={intl.translate({ id: 'app.close' })}
              onClose={() => setShowAlert(false)}
            >
              {error}
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
            disabled={isSubmitting && !error}
          >
            {(phase === 'credentials-validating' && intl.translate({ id: 'login.validating' })) ||
              (phase === 'userinfo-pulling' && intl.translate({ id: 'login.pulling' })) ||
              (phase === 'login-successful' && intl.translate({ id: 'login.successful' })) ||
              intl.translate({ id: 'login.login' })}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default connector(LoginJWT);
