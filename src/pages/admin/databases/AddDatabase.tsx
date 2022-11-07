import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormik } from 'formik';
import { Box, Grid, TextField } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { FormButtons, SaveButton } from 'utils/ActionLinks';

import { databaseDataSelector, databasesActions, IDatabase } from './_store/database';

const mapStateToProps = (state: RootState) => ({
  databaseData: databaseDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addDatabase: (databaseInfo: Partial<IDatabase>) =>
    dispatch(databasesActions.addDatabase(databaseInfo)),
  resetPhase: () => dispatch(databasesActions.setPhase(null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAddSeasonProps = PropsFromRedux & {
  handleClose?: () => void;
};

const AddSeason = (props: TAddSeasonProps) => {
  const { databaseData, addDatabase, resetPhase, handleClose } = props;
  const { phase } = databaseData;
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const initialValues: Partial<IDatabase> = {
    name: '',
    isCreated: false
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
    initialValues: initialValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });
  const validateForm = (values: Partial<IDatabase>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['name'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IDatabase>) => {
    setStatus('submitted');

    addDatabase(values);
  };

  React.useEffect(() => {
    if (status === 'submitted' && phase === 'success') {
      setSubmitting(false);

      showSnackbar({
        message: intl.translate({ id: 'app.saved' }),
        open: true
      });

      if (handleClose) {
        setTimeout(() => {
          handleClose();
        }, 500);
      }
    }
  }, [status, phase]);

  React.useEffect(() => {
    setStatus('notSubmitted');
    resetPhase();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <form
        style={{ width: '100%' }}
        className='form'
        noValidate={true}
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              autoFocus
              className={`${errors.name ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.name ? errors.name : ''}
              error={!!errors.name}
              fullWidth={true}
              id='name'
              label={intl.translate({ id: 'app.title' })}
              margin='normal'
              onChange={handleChange}
              value={values.name}
              variant='outlined'
            />
          </Grid>
        </Grid>

        <FormButtons
          saveButton={<SaveButton disabled={isSubmitting} mode={isSubmitting && 'saving'} />}
        />
      </form>
    </Box>
  );
};

export default connector(AddSeason);
