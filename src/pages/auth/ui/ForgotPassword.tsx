import { faPaperPlane, faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { prepareDataForValidation, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

import Login from 'components/links/Login';
import { authErrorSelector, authPhaseSelector } from 'pages/auth/services/store/auth';
import { basicList, PasswordMeterColor } from 'utils/Helpers';

import { authActions } from '../services/actions';

interface IFormValues {
  email: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ForgotPassword = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alert, setAlert] = React.useState<string>(null);
  const [passwordStrength, setPasswordStrength] = React.useState<number>();
  const [passwordWarning, setPasswordWarning] = React.useState<string>();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  // Selectors
  const authPhase = useSelector(authPhaseSelector);
  const authError = useSelector(authErrorSelector);

  const requiredTranslation = intl.formatMessage({ id: 'app.required' });
  const matchTranslation = intl.formatMessage({ id: 'account.password.should_match' });
  const strengthTranslation = intl.formatMessage({ id: 'account.password.criteria' });
  const invalidInputTranslation = intl.formatMessage({ id: 'error.invalid_input' });

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .required(requiredTranslation)
      .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, invalidInputTranslation),
    code: authPhase === 'code_sent' && Yup.string().required(requiredTranslation),
    newPassword:
      authPhase === 'code_sent' &&
      Yup.string()
        .required(requiredTranslation)
        .matches(
          /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
          strengthTranslation
        ),
    confirmPassword:
      authPhase === 'code_sent' &&
      Yup.string()
        .required(requiredTranslation)
        .oneOf([Yup.ref('newPassword'), null], matchTranslation)
  });

  const formInitialValues: IFormValues = {
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
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
    }

    if (authPhase === 'code_sent' && values.code === '') {
      errors['code'] = intl.formatMessage({ id: 'error.cannot_be_empty' });
    }

    if (authPhase === 'code_sent' && values.newPassword === '') {
      errors['newPassword'] = intl.formatMessage({ id: 'error.cannot_be_empty' });
    }

    if (authPhase === 'code_sent' && values.confirmPassword === '') {
      errors['confirmPassword'] = intl.formatMessage({ id: 'error.cannot_be_empty' });
    }

    const formValues = prepareDataForValidation(values);
    const validate = validateYupSchema(formValues, formSchema);

    // Password guesser
    const passwordGuesser: ZXCVBNResult = zxcvbn(values.newPassword);

    setPasswordStrength(passwordGuesser?.score);
    if (passwordGuesser?.feedback) {
      setPasswordWarning(passwordGuesser.feedback.warning);
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

  const handleClickShowPassword = () => () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const submitForm = (values: IFormValues) => {
    if (authPhase === 'code_sent') {
      dispatch(
        authActions.forgotPasswordSubmit(values.email, values.code, {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword
        })
      );
    } else {
      dispatch(authActions.forgotPassword(values.email));
    }
  };

  React.useEffect(() => {
    if (isSubmitting) {
      setAlert(null);
    }
  }, [isSubmitting]);

  React.useEffect(() => {
    if (authPhase === 'success') {
      setAlert(intl.formatMessage({ id: 'account.password.changed' }));
      setSubmitting(false);

      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } else if (authPhase === 'code_sent') {
      setSubmitting(false);
      setAlert(intl.formatMessage({ id: 'login.forgot_password.link_sent' }));
    } else if (authPhase === 'error') {
      setSubmitting(false);
      const name = intl.formatMessage({ id: 'user.email_address.no_override' });

      if (authError === 'email_is_empty') {
        setAlert(intl.formatMessage({ id: 'app.cannot_be_empty_w_name' }, { name: name }));
      } else if (authError === 'email_not_found') {
        setAlert(intl.formatMessage({ id: 'login.forgot_password.email_not_found' }));
      } else {
        setAlert(intl.formatMessage({ id: 'app.error' }) + ': ' + authError?.name);
      }
    } else {
      setAlert(null);
    }
  }, [authPhase]);

  // Set submitting false by default
  React.useEffect(() => {
    setSubmitting(false);
    setAlert(null);
    dispatch(authActions.setPhase(null, null));
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

              {authPhase === 'code_sent' && (
                <>
                  <TextField
                    disabled={isSubmitting}
                    fullWidth={true}
                    id='code'
                    label={intl.formatMessage({ id: 'register.code' })}
                    placeholder={intl.formatMessage({ id: 'register.code' })}
                    margin='normal'
                    value={values.code}
                    onChange={handleChange}
                    variant='outlined'
                    error={Boolean(touched.code && errors.code)}
                    helperText={touched.code && errors.code}
                  />

                  {/* New password start */}
                  <TextField
                    className={`${
                      errors.newPassword ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                    }`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.newPassword ? errors.newPassword : ''}
                    error={!!errors.newPassword}
                    fullWidth={true}
                    id='newPassword'
                    label={intl.formatMessage({ id: 'account.password.new' })}
                    margin='normal'
                    onChange={handleChange}
                    size='small'
                    value={values.newPassword}
                    variant='filled'
                    autoComplete='new-password'
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            tabIndex={-1}
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword()}
                            onMouseDown={handleMouseDownPassword}
                            size='large'
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
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
                  {/* New password end */}

                  {/* New password again start */}
                  <TextField
                    className={`${
                      errors.confirmPassword ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                    }`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.confirmPassword ? errors.confirmPassword : ''}
                    error={!!errors.confirmPassword}
                    fullWidth={true}
                    id='confirmPassword'
                    label={intl.formatMessage({ id: 'account.password.again' })}
                    margin='normal'
                    onChange={handleChange}
                    size='small'
                    value={values.confirmPassword}
                    variant='filled'
                    autoComplete='new-password'
                    type='password'
                  />
                  {/* New password again end */}
                </>
              )}

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

export default ForgotPassword;
