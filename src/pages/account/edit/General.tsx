import React from 'react';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  Snackbar,
  Slide,
  Grid,
  TextField,
  Card,
  CardHeader,
  Divider,
  CardContent,
  CardActions
} from '@mui/material';

// import { loginPhases } from 'store/auth';
import { SaveButton } from 'utils/ActionLinks';
import { IUser } from 'pages/account/account-types';

interface IGeneralProps {
  user: IUser;
  phase: string;
  updateUserInfo: (userId: string, user: Partial<IUser>) => void;
}
interface IFormValues {
  name: string;
  lastName: string;
  email: string;
}

const General = ({ user, phase, updateUserInfo }: IGeneralProps) => {
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  const intl = useIntl();

  const formInitialValues: IFormValues = {
    name: user.name,
    lastName: user.lastName,
    email: user.email
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

  const validateForm = (values: Partial<IFormValues>) => {
    const errors = {};
    const nonEmptyFields = ['name', 'lastName', 'email'];

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors['email'] = intl.formatMessage({ id: 'error.invalid_input' });
    }

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.formatMessage({ id: 'error.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: IFormValues) => {
    setStatus('submitted');
    updateUserInfo(user.uuid, values);
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  React.useEffect(() => {
    if (phase === 'userinfo-pull-successful') {
      setSubmitting(false);

      if (status === 'submitted') {
        setSnackbarMessage(intl.formatMessage({ id: 'app.saved' }));
        setOpenSnackbar(true);
      }
    }
    // eslint-disable-next-line
  }, [phase]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader title={intl.formatMessage({ id: 'user.update' })} />
        <Divider />

        <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  className=''
                  disabled={true}
                  fullWidth={true}
                  id='uuid'
                  label={intl.formatMessage({ id: 'user.user_id' })}
                  margin='normal'
                  value={user.uuid}
                  variant='outlined'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  className={`${errors.name ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.name ? errors.name : ''}
                  error={!!errors.name}
                  fullWidth={true}
                  id='name'
                  label={intl.formatMessage({ id: 'user.name' })}
                  margin='normal'
                  onChange={handleChange}
                  value={values.name}
                  variant='outlined'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  className={`${errors.lastName ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.lastName ? errors.lastName : ''}
                  error={!!errors.lastName}
                  fullWidth={true}
                  id='lastName'
                  label={intl.formatMessage({ id: 'user.lastname' })}
                  margin='normal'
                  onChange={handleChange}
                  value={values.lastName}
                  variant='outlined'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  className={`${errors.email ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.email ? errors.email : ''}
                  error={!!errors.email}
                  fullWidth={true}
                  id='email'
                  label={intl.formatMessage({ id: 'user.email_address' })}
                  margin='normal'
                  onChange={handleChange}
                  value={values.email}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions sx={{ p: 2 }}>
            <SaveButton mode={isSubmitting ? 'saving' : ''} />
          </CardActions>
        </form>
      </Card>

      <Snackbar
        autoHideDuration={5000}
        message={snackbarMessage}
        onClose={() => setOpenSnackbar(false)}
        open={openSnackbar}
        TransitionComponent={Slide}
      />
    </React.Fragment>
  );
};

export default General;
