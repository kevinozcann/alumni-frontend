import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Slide,
  Snackbar,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

// import { loginPhases } from 'store/auth';
import { IUser } from 'pages/auth/data/account-types';
import { authPhaseSelector, authUserSelector } from 'pages/auth/services/store/auth';
import { SaveButton } from 'utils/ActionLinks';
import { authActions } from 'pages/auth/services/actions';

interface IFormValues {
  name: string;
  lastName: string;
}

const General = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');

  const user = useSelector(authUserSelector);
  const phase = useSelector(authPhaseSelector);

  const userAttributes: IUser = user.attributes;

  const formInitialValues: IFormValues = {
    name: userAttributes.name,
    lastName: userAttributes.family_name
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
    const nonEmptyFields = ['name', 'lastName'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.formatMessage({ id: 'error.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: IFormValues) => {
    setStatus('submitted');
    dispatch(
      authActions.updateUserInfo({
        attributes: {
          name: values.name,
          family_name: values.lastName
        }
      })
    );
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  React.useEffect(() => {
    if (phase === 'success') {
      setSubmitting(false);

      if (status === 'submitted') {
        setSnackbarMessage(intl.formatMessage({ id: 'app.saved' }));
        setOpenSnackbar(true);
      }
    }
  }, [phase]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader title={intl.formatMessage({ id: 'user.update' })} />
        <Divider />

        <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  className=''
                  disabled={true}
                  fullWidth={true}
                  id='uuid'
                  label={intl.formatMessage({ id: 'user.user_id' })}
                  margin='normal'
                  value={userAttributes.sub}
                  variant='filled'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  className=''
                  disabled={true}
                  fullWidth={true}
                  id='email'
                  label={intl.formatMessage({ id: 'email.email' })}
                  margin='normal'
                  value={userAttributes.email}
                  variant='filled'
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
