import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useTranslation from 'hooks/useTranslation';
import { authActions, authErrorSelector, authPhaseSelector, authUserSelector } from 'store/auth';
import { useNavigate } from 'react-router';

type FormValues = {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phoneNumber: string;
};

const Registration = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors
  const user = useSelector(authUserSelector);
  const phase = useSelector(authPhaseSelector);
  const error = useSelector(authErrorSelector);

  const transEmail = intl.translate({ id: 'email.email' });

  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      lastName: '',
      phoneNumber: ''
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
    dispatch(
      authActions.register(
        values.email,
        values.password,
        values.name,
        values.lastName,
        values.phoneNumber
      )
    );
  };

  React.useEffect(() => {
    if (user.authenticationFlowType === 'USER_SRP_AUTH') {
      setTimeout(() => {
        navigate('/auth/verify');
      }, 5000);
    }
  }, [user]);

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
          name='name'
          label={intl.translate({ id: 'user.name' })}
          margin='normal'
          variant='outlined'
          placeholder={intl.translate({ id: 'user.name' })}
          onChange={handleChange}
          value={values.name}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
        />

        <TextField
          autoFocus
          fullWidth
          name='lastName'
          label={intl.translate({ id: 'user.lastname' })}
          margin='normal'
          variant='outlined'
          placeholder={intl.translate({ id: 'user.lastname' })}
          onChange={handleChange}
          value={values.lastName}
          error={Boolean(touched.lastName && errors.lastName)}
          helperText={touched.lastName && errors.lastName}
        />

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

        <TextField
          autoFocus
          fullWidth
          name='phoneNumber'
          label={intl.translate({ id: 'user.phone_number' })}
          margin='normal'
          variant='outlined'
          placeholder={intl.translate({ id: 'user.phone_number' })}
          onChange={handleChange}
          value={values.phoneNumber}
          error={Boolean(touched.phoneNumber && errors.phoneNumber)}
          helperText={touched.phoneNumber && errors.phoneNumber}
        />

        <TextField
          autoFocus
          fullWidth
          type='password'
          name='password'
          autoComplete='username'
          label={intl.translate({ id: 'account.password' })}
          margin='normal'
          variant='outlined'
          placeholder={intl.translate({ id: 'account.password' })}
          onChange={handleChange}
          value={values.password}
          error={Boolean(touched.password && errors.password)}
          helperText={touched.password && errors.password}
        />

        {(error && (
          <Box sx={{ mt: 2 }}>
            <Alert variant='outlined' severity='error'>
              {error?.message}
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
