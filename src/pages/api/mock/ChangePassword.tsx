import React from 'react';
import { useFormik, prepareDataForValidation, validateYupSchema, yupToFormErrors } from 'formik';
import { useIntl } from 'react-intl';
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CardActions,
  CardContent,
  Divider,
  CardHeader,
  Card,
  Box
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as Yup from 'yup';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

import { TUserPassword } from 'store/auth';
import useSnackbar from 'hooks/useSnackbar';
import { SaveButton } from 'utils/ActionLinks';
import { basicList, PasswordMeterColor } from 'utils/Helpers';
import { TLang } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';

interface ISecurityProps {
  title?: string;
  description?: string;
  showCurrentPassword?: boolean;
  resetId?: string;
  lang: TLang;
  user: IUser;
  phase: string;
  error: string;
  changeUserPassword: (
    lang: TLang,
    userId: string,
    email: string,
    user: TUserPassword,
    resetId: string
  ) => void;
}

const ChangePassword = ({
  title,
  description,
  showCurrentPassword,
  resetId,
  lang,
  user,
  phase,
  error,
  changeUserPassword
}: ISecurityProps) => {
  const intl = useIntl();
  const { showSnackbar } = useSnackbar();
  const [passwordStrength, setPasswordStrength] = React.useState<number>();
  const [passwordWarning, setPasswordWarning] = React.useState<string>();
  const [passwordSuggestion, setPasswordSuggestion] = React.useState<string[]>();
  const [showPassword, setShowPassword] = React.useState({
    currentPassword: false,
    newPassword: false
  });

  const requiredTranslation = intl.formatMessage({ id: 'app.required' });
  const matchTranslation = intl.formatMessage({ id: 'account.password.should_match' });
  const strengthTranslation = intl.formatMessage({ id: 'account.password.criteria' });
  const formSchema = Yup.object().shape({
    currentPassword: showCurrentPassword && Yup.string().required(requiredTranslation),
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

  const formInitialValues: TUserPassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    isSubmitting,
    setSubmitting,
    status,
    setStatus
  } = useFormik({
    initialValues: formInitialValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });

  const validateForm = (values: Partial<TUserPassword>) => {
    if (!values.newPassword) {
      const errors = {};
      errors['newPassword'] = intl.formatMessage({ id: 'error.cannot_be_empty' });
      errors['confirmPassword'] = intl.formatMessage({ id: 'error.cannot_be_empty' });
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

  const submitForm = (values: TUserPassword) => {
    setStatus('submitted');
    changeUserPassword(lang, user?.uuid || '', user?.email || '', values, resetId);
  };

  React.useEffect(() => {
    if (phase === 'login-error' && status === 'submitted') {
      setSubmitting(false);

      const loginError =
        (error === 'Invalid credentials.' && 'login.reset_password.password_wrong') ||
        (error === 'Geçersiz kimlik bilgileri.' && 'login.reset_password.password_wrong') ||
        error;

      showSnackbar({
        message: intl.formatMessage({ id: loginError }),
        open: true
      });
    }

    if (phase === 'reset-error' && status === 'submitted') {
      setSubmitting(false);

      showSnackbar({
        message: intl.formatMessage({ id: error }),
        open: true
      });
    }

    if (phase === 'userinfo-pull-successful') {
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.formatMessage({ id: 'account.password.changed' }),
          open: true
        });
      }
    }
  }, [phase]);

  return (
    <React.Fragment>
      <Card sx={{ maxWidth: (resetId && 400) || '100%' }}>
        <CardHeader title={intl.formatMessage({ id: title || 'account.security' })} />
        <Divider />

        {description && (
          <Alert style={{ borderRadius: 0 }} icon={false} severity='info'>
            {intl.formatMessage({ id: description })}
          </Alert>
        )}

        <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              {/* Current password start */}
              {showCurrentPassword && (
                <Grid item xs={12}>
                  <TextField
                    className={`${
                      errors.currentPassword ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                    }`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.currentPassword ? errors.currentPassword : ''}
                    error={!!errors.currentPassword}
                    fullWidth={true}
                    id='currentPassword'
                    label={intl.formatMessage({ id: 'account.password.current' })}
                    margin='normal'
                    onChange={handleChange}
                    size='small'
                    value={values.currentPassword}
                    variant='filled'
                    autoComplete='new-password'
                    type={showPassword.currentPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            tabIndex={-1}
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword('currentPassword')}
                            onMouseDown={handleMouseDownPassword}
                            size='large'
                          >
                            {showPassword.currentPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              )}
              {/* Current password end */}

              {/* New password start */}
              <Grid item xs={12} md={(showCurrentPassword && 6) || 12}>
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
              </Grid>
              {/* New password end */}

              {/* New password again start */}
              <Grid item xs={12} md={(showCurrentPassword && 6) || 12}>
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
              </Grid>
              {/* New password again end */}

              {phase === 'reset-error' && status === 'submitted' && (
                <Grid item xs={12}>
                  <Alert sx={{ whiteSpace: 'normal', maxWidth: 'inherit' }} severity='error'>
                    {intl.formatMessage({ id: 'login.reset_password.link_not_found' })}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>

          <CardActions sx={{ p: 2 }}>
            <SaveButton mode={isSubmitting ? 'saving' : ''} />
          </CardActions>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default ChangePassword;
