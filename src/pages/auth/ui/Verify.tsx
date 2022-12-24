import { faInfoCircle, faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useTranslation from 'hooks/useTranslation';
import LabelWithIcon from 'utils/LabelWithIcon';

import { authErrorSelector, authPhaseSelector, authUserSelector } from '../services/auth';
import { authActions } from '../services/actions';

type TFormValues = {
  email: string;
  code: string;
};

const Verify = () => {
  const intl = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitted, setSubmitted] = React.useState(false);

  // Selectors
  const user = useSelector(authUserSelector);
  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const transCode = intl.translate({ id: 'register.code' });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting, setSubmitting } =
    useFormik({
      initialValues: {
        email: user.username,
        code: ''
      },
      validate: (values: TFormValues) => validateForm(values),
      onSubmit: (values: TFormValues) => submitForm(values)
    });

  const validateForm = (values: TFormValues) => {
    const errors: { [key: string]: any } = {};

    if (!values.code) {
      errors.lastname = intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transCode });
      return errors;
    }
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const submitForm = (values: TFormValues) => {
    setSubmitted(true);
    dispatch(authActions.verify(values.email, values.code));
  };

  React.useEffect(() => {
    if (authError) {
      setSubmitting(false);
    }
  }, [authError, authPhase]);

  React.useEffect(() => {
    if (user.userConfirmed) {
      setTimeout(() => {
        navigate('/auth/login');
      }, 5000);
    }
  }, [user]);

  React.useEffect(() => {
    dispatch(authActions.setPhase(null, null));
  }, []);

  return (
    <Box sx={{ width: 350 }}>
      <>
        <LabelWithIcon
          icon={<FontAwesomeIcon icon={faInfoCircle} color='blue' size='2x' />}
          label={intl.translate({ id: 'register.input_code' })}
        />

        <Box sx={{ height: '16px' }} />

        <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
          <TextField
            fullWidth
            autoComplete='off'
            disabled={true}
            name='email'
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
            autoComplete='off'
            disabled={isSubmitting}
            name='code'
            label={intl.translate({ id: 'register.code' })}
            margin='normal'
            variant='outlined'
            placeholder={intl.translate({ id: 'register.code' })}
            onChange={handleChange}
            value={values.code}
            error={Boolean(touched.code && errors.code)}
            helperText={touched.code && errors.code}
          />

          {authError && isSubmitted && (
            <Box sx={{ mt: 2 }}>
              <Alert variant='outlined' severity='error'>
                {authError}
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
              disabled={authPhase?.includes('verifying')}
              startIcon={
                (authPhase?.includes('verifying') && (
                  <FontAwesomeIcon icon={faSpinner} spin={true} />
                )) ||
                null
              }
            >
              {intl.translate({ id: 'register.verify' })}
            </Button>
          </Box>
        </form>
      </>

      {(authPhase === 'error' && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Alert variant='outlined' severity='error'>
            {intl.formatMessage({ id: 'register.email_verified_not' })}
          </Alert>
        </Box>
      )) ||
        (authPhase === 'success' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Alert variant='outlined' severity='success'>
              {intl.formatMessage({ id: 'register.email_verified' })}
            </Alert>
          </Box>
        ))}
    </Box>
  );
};

export default Verify;
