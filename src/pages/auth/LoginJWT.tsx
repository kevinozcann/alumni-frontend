import React from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';

import {
  authActions,
  authPhaseSelector,
  authErrorSelector,
  authUserSelector,
  authAccessTokenSelector
} from 'store/auth';
import { i18nLangSelector } from 'store/i18n';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';

type FormValues = {
  email: string;
  password: string;
};

export const LoginJWT = () => {
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const { login } = useAuth();
  const intl = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors
  const lang = useSelector(i18nLangSelector);
  const user = useSelector(authUserSelector);
  const accessToken = useSelector(authAccessTokenSelector);
  const phase = useSelector(authPhaseSelector);
  const error = useSelector(authErrorSelector);

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
    dispatch(authActions.login(values.email, values.password));
  };

  React.useEffect(() => {
    dispatch(authActions.setPhase(null, null));
  }, []);

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
          autoComplete='username'
          label={intl.translate({ id: 'user.email_address' })}
          margin='normal'
          variant='outlined'
          placeholder={intl.translate({ id: 'user.email_address' })}
          onChange={handleChange}
          value={values.email}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />

        <TextField
          fullWidth
          type='password'
          name='password'
          autoComplete='current-password'
          margin='normal'
          variant='outlined'
          label={intl.translate({ id: 'account.password' })}
          placeholder={intl.translate({ id: 'account.password' })}
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
              {(error === 'Google user not registered!' &&
                intl.translate(
                  { id: 'login.error_user_not_registered_name' },
                  { name: 'Google' }
                )) ||
                (error === 'Facebook user not registered!' &&
                  intl.translate(
                    { id: 'login.error_user_not_registered_name' },
                    { name: 'Facebook' }
                  )) ||
                error}
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
              (phase === 'userinfo-pull-successful' &&
                intl.translate({ id: 'login.pulling.successful' })) ||
              (phase === 'active-school-updating' &&
                intl.translate({ id: 'login.updating.school' })) ||
              (phase === 'active-school-update-successful' &&
                intl.translate({ id: 'login.updating.school.successful' })) ||
              (phase === 'active-season-updating' &&
                intl.translate({ id: 'login.updating.season' })) ||
              (phase === 'active-season-update-successful' &&
                intl.translate({ id: 'login.updating.season.successful' })) ||
              (phase === 'menu-updating' && intl.translate({ id: 'login.updating.menus' })) ||
              (phase === 'menu-update-successful' &&
                intl.translate({ id: 'login.updating.menus.successful' })) ||
              (phase === 'login-successful' && intl.translate({ id: 'login.successful' })) ||
              intl.translate({ id: 'login.login' })}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LoginJWT;
