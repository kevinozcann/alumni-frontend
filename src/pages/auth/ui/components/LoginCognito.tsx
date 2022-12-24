import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import useTranslation from 'hooks/useTranslation';
import { isLocalhost } from 'utils/Helpers';

import { authErrorSelector, authPhaseSelector, authUserSelector } from '../../services/store/auth';
import { authActions } from '../../services/actions';

type FormValues = {
  email: string;
  password: string;
};

export const LoginCognito = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = React.useState(false);

  // Selectors
  const user = useSelector(authUserSelector);
  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const transEmail = intl.translate({ id: 'user.email_address' });
  const transPassword = intl.translate({ id: 'account.password' });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting, setSubmitting } =
    useFormik({
      initialValues: {
        email: isLocalhost ? process.env.REACT_APP_DEV_USERNAME : '',
        password: isLocalhost ? process.env.REACT_APP_DEV_PASSWORD : ''
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
    dispatch(authActions.login(values.email, values.password));
  };

  React.useEffect(() => {
    if (authError) {
      setSubmitting(false);
    }
  }, [authError, authPhase]);

  React.useEffect(() => {
    if (user && authPhase === 'success') {
      setTimeout(() => {
        navigate('/account/home');
      }, 500);
    }
  }, [user, authPhase]);

  React.useEffect(() => {
    dispatch(authActions.setPhase(null, null));
  }, []);

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

        {authError && (
          <Box sx={{ mt: 2 }}>
            <Alert
              variant='outlined'
              severity='error'
              closeText={intl.translate({ id: 'app.close' })}
              onClose={() => dispatch(authActions.setPhase(null, null))}
            >
              {typeof authError === 'object'
                ? authError.hasOwnProperty('code')
                  ? authError.code
                  : ''
                : authError}
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
            disabled={isSubmitting && !authError}
          >
            {(authPhase === 'validating' && intl.translate({ id: 'login.validating' })) ||
              (authPhase === 'success' && intl.translate({ id: 'login.successful' })) ||
              intl.translate({ id: 'login.login' })}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LoginCognito;
