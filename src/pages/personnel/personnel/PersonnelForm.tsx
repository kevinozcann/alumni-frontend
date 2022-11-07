import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { Box, Divider, Grid, TextField } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector } from 'store/user';
import { authUserSelector } from 'store/auth';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { CancelButton, FormButtons, SaveButton } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';
import { IPerson } from 'pages/personnel/_store/types';

import { personnelActions, personnelDataSelector } from './_store/personnel';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  personnelData: personnelDataSelector(state),
  user: authUserSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addPerson: (person: Partial<IPerson>) => dispatch(personnelActions.addPerson(person)),
  updatePerson: (id: number, person: Partial<IPerson>) =>
    dispatch(personnelActions.updatePerson(id, person)),
  resetPhase: () => dispatch(personnelActions.setPhase(null))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: () => void;
};

const PersonnelForm = (props: TFormProps) => {
  const { id } = useParams();
  const {
    actionType,
    sideForm,
    handleClose,
    activeSchool,
    personnelData,
    addPerson,
    updatePerson,
    resetPhase
  } = props;
  const { personnel, phase } = personnelData;
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const personEdit = (id && personnel.find((p) => p.id === parseInt(id))) || null;

  const initialFormValues: Partial<IPerson> = {
    name: (actionType === 'new' && '') || personEdit?.name || '',
    lastname: (actionType === 'new' && '') || personEdit?.lastname || '',
    mobile: (actionType === 'new' && '') || personEdit?.mobile || '',
    emailAddress: (actionType === 'new' && '') || personEdit?.emailAddress || ''
  };
  const {
    handleSubmit,
    handleChange,
    values,
    initialValues,
    errors,
    isSubmitting,
    setSubmitting,
    status,
    setStatus
  } = useFormik({
    initialValues: initialFormValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });
  const validateForm = (values: Partial<IPerson>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['name', 'lastname', 'mobile', 'emailAddress'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IPerson>) => {
    if (values !== initialValues) {
      setStatus('submitted');
      setSubmitting(true);

      if (actionType === 'add') {
        const personAdd: Partial<IPerson> = {
          name: values.name,
          lastname: values.lastname,
          mobile: values.mobile,
          emailAddress: values.emailAddress,
          isActive: true,
          school: activeSchool.id
        };
        // Add the person
        addPerson(personAdd);
      } else {
        updatePerson(parseInt(id), values);
      }
    }
  };

  React.useEffect(() => {
    if (status === 'submitted' && phase === 'success') {
      setSubmitting(false);

      showSnackbar({
        message: intl.translate({ id: 'app.saved' }),
        open: true
      });

      if (!sideForm) {
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
        <Grid container spacing={3} rowSpacing={1}>
          <Grid item xs={12} md={(sideForm && 12) || 6}>
            <TextField
              id='name'
              autoFocus
              className={`${errors.name ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.name ? errors.name : ''}
              error={!!errors.name}
              fullWidth={true}
              label={intl.translate({ id: 'person.name' })}
              value={values.name}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={(sideForm && 12) || 6}>
            <TextField
              id='lastname'
              className={`${errors.lastname ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.lastname ? errors.lastname : ''}
              error={!!errors.lastname}
              fullWidth={true}
              label={intl.translate({ id: 'person.lastname' })}
              value={values.lastname}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={(sideForm && 12) || 6}>
            <TextField
              id='mobile'
              className={`${errors.mobile ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.mobile ? errors.mobile : ''}
              error={!!errors.mobile}
              fullWidth={true}
              label={intl.translate({ id: 'person.mobile' })}
              value={values.mobile}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={(sideForm && 12) || 6}>
            <TextField
              id='emailAddress'
              className={`${errors.emailAddress ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.emailAddress ? errors.emailAddress : ''}
              error={!!errors.emailAddress}
              fullWidth={true}
              label={intl.translate({ id: 'person.email' })}
              value={values.emailAddress}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2, mb: 1 }} />

        <FormButtons
          saveButton={
            <SaveButton
              disabled={values === initialValues || isSubmitting}
              mode={isSubmitting && 'saving'}
            />
          }
          cancelButton={<CancelButton onClick={handleClose} />}
        />
      </form>
    </Box>
  );
};

export default connector(PersonnelForm);
