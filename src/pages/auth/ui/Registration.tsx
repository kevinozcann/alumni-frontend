import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { prepareDataForValidation, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

import useTranslation from 'hooks/useTranslation';
import { basicList, PasswordMeterColor } from 'utils/Helpers';

import { authErrorSelector, authPhaseSelector, authUserSelector } from '../services/auth';
import { authActions } from '../services/actions';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  lastname: string;
  phoneNumber: string;
};

const Registration = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState({
    password: false,
    confirmPassword: false
  });
  const [passwordStrength, setPasswordStrength] = React.useState<number>();
  const [passwordWarning, setPasswordWarning] = React.useState<string>();
  const [passwordSuggestion, setPasswordSuggestion] = React.useState<string[]>();

  // Selectors
  const user = useSelector(authUserSelector);
  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const transName = intl.translate({ id: 'user.name' });
  const transLastname = intl.translate({ id: 'user.lastname' });
  const transEmail = intl.translate({ id: 'email.email' });
  const requiredTranslation = intl.formatMessage({ id: 'app.required' });
  const matchTranslation = intl.formatMessage({ id: 'account.password.should_match' });
  const strengthTranslation = intl.formatMessage({ id: 'account.password.criteria' });

  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required(requiredTranslation)
      .matches(
        /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
        strengthTranslation
      ),
    confirmPassword: Yup.string()
      .required(requiredTranslation)
      .oneOf([Yup.ref('password'), null], matchTranslation)
  });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting, setSubmitting } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        lastname: '',
        phoneNumber: ''
      },
      validate: (values: FormValues) => validateForm(values),
      onSubmit: (values: FormValues) => submitForm(values)
    });

  const validateForm = (values: Record<string, string>) => {
    const errors: { [key: string]: any } = {};

    if (!values.name) {
      errors.name = intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transName });
      return errors;
    } else if (!values.lastname) {
      errors.lastname = intl.translate(
        { id: 'app.cannot_be_empty_w_name' },
        { name: transLastname }
      );
      return errors;
    } else if (!values.email) {
      errors.email = intl.translate({ id: 'app.cannot_be_empty_w_name' }, { name: transEmail });
      return errors;
    } else if (!/\S+@\S+\.\S+/.test(`${values.email}`)) {
      errors.email = intl.translate({ id: 'login.invalid_email' });
      return errors;
    }

    const formValues = prepareDataForValidation(values);
    const validate = validateYupSchema(formValues, formSchema);

    // Password guesser
    const passwordGuesser: ZXCVBNResult = zxcvbn(values.password);

    setPasswordStrength(passwordGuesser?.score);
    if (passwordGuesser?.feedback) {
      setPasswordWarning(passwordGuesser.feedback.warning);
      setPasswordSuggestion(passwordGuesser.feedback.suggestions);
    }
    return validate.then(
      (_response) => {
        return {};
      },
      (error) => {
        return yupToFormErrors(error);
      }
    );
  };

  const handleClickShowPassword = (elt: any) => () => {
    setShowPassword({ ...showPassword, [elt]: !showPassword[elt] });
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const submitForm = (values: FormValues) => {
    dispatch(
      authActions.register(
        values.email,
        values.password,
        values.name,
        values.lastname,
        values.phoneNumber
      )
    );
  };

  React.useEffect(() => {
    if (authError) {
      setSubmitting(false);
    }
  }, [authError, authPhase]);

  React.useEffect(() => {
    if (user && !user.userConfirmed) {
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
        {intl.translate({ id: 'register.fill_form' })}
      </Typography>

      <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
        <TextField
          autoFocus
          fullWidth
          disabled={isSubmitting}
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
          fullWidth
          autoComplete='off'
          disabled={isSubmitting}
          name='lastname'
          label={intl.translate({ id: 'user.lastname' })}
          margin='normal'
          variant='outlined'
          placeholder={intl.translate({ id: 'user.lastname' })}
          onChange={handleChange}
          value={values.lastname}
          error={Boolean(touched.lastname && errors.lastname)}
          helperText={touched.lastname && errors.lastname}
        />

        <TextField
          fullWidth
          type='email'
          name='email'
          disabled={isSubmitting}
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
          fullWidth
          name='phoneNumber'
          disabled={isSubmitting}
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
          className={`${errors.password ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
          disabled={isSubmitting}
          helperText={errors.password ? errors.password : ''}
          error={!!errors.password}
          fullWidth
          id='password'
          label={intl.formatMessage({ id: 'account.password.new' })}
          margin='normal'
          onChange={handleChange}
          value={values.password}
          variant='outlined'
          autoComplete='new-password'
          type={showPassword.password ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  tabIndex={-1}
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword('password')}
                  onMouseDown={handleMouseDownPassword}
                  size='large'
                >
                  {showPassword.password ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Box
          sx={{
            mb: 1,
            background: (passwordStrength && PasswordMeterColor(passwordStrength)) || 'transparent',
            borderRadius: '5px',
            boxSizing: 'border-box',
            display: (passwordStrength && 'block') || 'none',
            height: '5px',
            left: 0,
            position: 'relative',
            top: '1px',
            right: '0',
            transition: 'width 300ms ease-out',
            width: `${(passwordStrength + 1) * 20}%` ?? '0'
          }}
        />
        {/* strength={passwordStrength} */}
        {passwordWarning && (
          <Alert sx={{ whiteSpace: 'normal' }} className='mb-1' severity='warning'>
            {passwordWarning}
          </Alert>
        )}
        {passwordSuggestion?.length > 0 && (
          <Alert sx={{ whiteSpace: 'normal' }} severity='info'>
            {basicList(passwordSuggestion)}
          </Alert>
        )}

        <TextField
          className={`${errors.confirmPassword ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
          disabled={isSubmitting}
          helperText={errors.confirmPassword ? errors.confirmPassword : ''}
          error={!!errors.confirmPassword}
          fullWidth
          id='confirmPassword'
          label={intl.formatMessage({ id: 'account.password.again' })}
          margin='normal'
          onChange={handleChange}
          value={values.confirmPassword}
          variant='outlined'
          autoComplete='new-password'
          type={showPassword.confirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  tabIndex={-1}
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword('confirmPassword')}
                  onMouseDown={handleMouseDownPassword}
                  size='large'
                >
                  {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {(authError && (
          <Box sx={{ mt: 2 }}>
            <Alert variant='outlined' severity='error'>
              {authError?.message}
            </Alert>
          </Box>
        )) ||
          (authPhase === 'success' && (
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
            disabled={authPhase?.includes('ing')}
            startIcon={
              (authPhase?.includes('ing') && <FontAwesomeIcon icon={faSpinner} spin={true} />) ||
              null
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
