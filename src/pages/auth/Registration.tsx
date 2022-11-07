import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';

import { i18nLangSelector } from 'store/i18n';
import { authActions, authErrorSelector, authPhaseSelector } from 'store/auth';
import useTranslation from 'hooks/useTranslation';

type FormValues = {
  email: string;
};

const Registration = () => {
  const intl = useTranslation();
  const dispatch = useDispatch();

  // Selectors
  const lang = useSelector(i18nLangSelector);
  const phase = useSelector(authPhaseSelector);
  const error = useSelector(authErrorSelector);

  const transEmail = intl.translate({ id: 'email.email' });

  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: {
      email: ''
    },
    validate: (values: FormValues) => validateForm(values),
    onSubmit: (values: FormValues) => submitForm(values)
  });

  const validateForm = (values: Record<string, unknown>) => {
    const errors: { [key: string]: any } = {};

    if (!values.email) {
      errors.email = intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transEmail });
    } else if (!/\S+@\S+\.\S+/.test(`${values.email}`)) {
      errors.email = intl.translate({ id: 'login.invalid_email' });
    }

    return errors;
  };

  const submitForm = (values: FormValues) => {
    dispatch(authActions.register(lang, values.email));
  };

  React.useEffect(() => {
    dispatch(authActions.setPhase(null, null));
  }, []);

  return (
    <Box sx={{ width: 350 }}>
      <Typography sx={{ mb: 2 }} variant='body1' color='textPrimary'>
        {intl.translate({ id: 'register.input_email' })}
      </Typography>

      <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
        <TextField
          autoFocus
          fullWidth
          type='email'
          name='email'
          autoComplete='username'
          label={intl.translate({ id: 'email.email' })}
          margin='normal'
          variant='outlined'
          placeholder={intl.translate({ id: 'email.email' })}
          onChange={handleChange}
          value={values.email}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />

        {(error && (
          <Box sx={{ mt: 2 }}>
            <Alert variant='outlined' severity='error'>
              {intl.translate({ id: 'register.user_found' })}
            </Alert>
          </Box>
        )) ||
          (phase === 'success' && (
            <Box sx={{ mt: 2 }}>
              <Alert variant='outlined' severity='success'>
                {intl.translate({ id: 'register.email_sent' })}
              </Alert>
            </Box>
          ))}

        <Box sx={{ mt: 2 }}>
          <Button
            color='primary'
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            disabled={phase?.includes('ing')}
            startIcon={
              (phase?.includes('ing') && <FontAwesomeIcon icon={faSpinner} spin={true} />) || null
            }
          >
            {intl.translate({ id: 'register' })}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Registration;
