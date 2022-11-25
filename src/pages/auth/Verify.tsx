import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { prepareDataForValidation, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';
import * as Yup from 'yup';

import { i18nLangSelector } from 'store/i18n';
import { authActions, authErrorSelector, authPhaseSelector } from 'store/auth';
import { userActions, userErrorSelector, userPhaseSelector } from 'store/user';
import useTranslation from 'hooks/useTranslation';
import LabelWithIcon from 'utils/LabelWithIcon';
import Login from 'components/links/Login';
import { basicList, PasswordMeterColor } from 'utils/Helpers';

type TFormValues = {
  name: string;
  lastname: string;
  newPassword: string;
  confirmPassword: string;
};

const Verify = () => {
  const intl = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSubmitted, setSubmitted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState({
    newPassword: false,
    confirmPassword: false
  });
  const [passwordStrength, setPasswordStrength] = React.useState<number>();
  const [passwordWarning, setPasswordWarning] = React.useState<string>();
  const [passwordSuggestion, setPasswordSuggestion] = React.useState<string[]>();

  const code = new URLSearchParams(location.search).get('code');
  const email = new URLSearchParams(location.search).get('email');

  // Selectors
  const lang = useSelector(i18nLangSelector);
  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);
  const userError = useSelector(userErrorSelector);
  const userPhase = useSelector(userPhaseSelector);

  const transName = intl.translate({ id: 'user.name' });
  const transLastname = intl.translate({ id: 'user.lastname' });
  const requiredTranslation = intl.formatMessage({ id: 'app.required' });
  const matchTranslation = intl.formatMessage({ id: 'account.password.should_match' });
  const strengthTranslation = intl.formatMessage({ id: 'account.password.criteria' });

  const formSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required(requiredTranslation)
      .matches(
        /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
        strengthTranslation
      ),
    confirmPassword: Yup.string()
      .required(requiredTranslation)
      .oneOf([Yup.ref('newPassword'), null], matchTranslation)
  });

  const { handleSubmit, handleChange, values, errors, touched, isSubmitting, setSubmitting } =
    useFormik({
      initialValues: {
        name: '',
        lastname: '',
        newPassword: '',
        confirmPassword: ''
      },
      validate: (values: TFormValues) => validateForm(values),
      onSubmit: (values: TFormValues) => submitForm(values)
    });

  const validateForm = (values: TFormValues) => {
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
    }

    const formValues = prepareDataForValidation(values);
    const validate = validateYupSchema(formValues, formSchema);

    // Password guesser
    const passwordGuesser: ZXCVBNResult = zxcvbn(values.newPassword);

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

  const submitForm = (values: TFormValues) => {
    setSubmitted(true);
    dispatch(
      userActions.addUser(
        email,
        values.name,
        values.lastname,
        values.newPassword,
        '/api/user_types/16'
      )
    );
  };

  React.useEffect(() => {
    if (authError || userError) {
      setSubmitting(false);
    }
  }, [authError, userError, authPhase, userPhase]);

  React.useEffect(() => {
    dispatch(authActions.setPhase(null, null));
    dispatch(authActions.verify(lang, email, code));
  }, []);

  return (
    <Box sx={{ width: 350 }}>
      {(authPhase === 'verifying' && !isSubmitted && (
        <LabelWithIcon
          icon={<FontAwesomeIcon icon={faSpinner} spin={true} size='2x' />}
          label={intl.translate({ id: 'register.email_verifying' })}
        />
      )) ||
        (authPhase === 'verified' && userPhase !== 'success' && (
          <>
            <LabelWithIcon
              icon={<FontAwesomeIcon icon={faCheckCircle} color='green' size='2x' />}
              label={intl.translate({ id: 'register.email_verified' })}
            />

            <Box sx={{ height: '16px' }} />

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
                className={`${errors.newPassword ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                disabled={isSubmitting}
                helperText={errors.newPassword ? errors.newPassword : ''}
                error={!!errors.newPassword}
                fullWidth
                id='newPassword'
                label={intl.formatMessage({ id: 'account.password.new' })}
                margin='normal'
                onChange={handleChange}
                value={values.newPassword}
                variant='outlined'
                autoComplete='new-password'
                type={showPassword.newPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        tabIndex={-1}
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword('newPassword')}
                        onMouseDown={handleMouseDownPassword}
                        size='large'
                      >
                        {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Box
                sx={{
                  mb: 1,
                  background:
                    (passwordStrength && PasswordMeterColor(passwordStrength)) || 'transparent',
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
                className={`${
                  errors.confirmPassword ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                }`}
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

              {authError && isSubmitted && (
                <Box sx={{ mt: 2 }}>
                  <Alert variant='outlined' severity='error'>
                    {authError}
                  </Alert>
                </Box>
              )}

              {userError && isSubmitted && (
                <Box sx={{ mt: 2 }}>
                  <Alert variant='outlined' severity='error'>
                    {userError}
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
                  disabled={userPhase?.includes('adding')}
                  startIcon={
                    (userPhase?.includes('adding') && (
                      <FontAwesomeIcon icon={faSpinner} spin={true} />
                    )) ||
                    null
                  }
                >
                  {intl.translate({ id: 'register' })}
                </Button>
              </Box>
            </form>
          </>
        )) ||
        (authPhase === 'error' && userPhase !== 'success' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Alert variant='outlined' severity='error'>
              {intl.formatMessage({ id: 'register.email_verified_not' })}
            </Alert>

            <Link color='textSecondary' href='/register'>
              <Typography sx={{ mt: 1 }} variant='body1' color='textPrimary'>
                {intl.formatMessage({ id: 'register' })}
              </Typography>
            </Link>
          </Box>
        )) ||
        (userPhase === 'success' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Alert variant='outlined' severity='success'>
              {intl.formatMessage({ id: 'user.created' })}
            </Alert>

            <Login />
          </Box>
        ))}
    </Box>
  );
};

export default Verify;
