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
import { IClass } from 'pages/classes/_store/types';

import { classesActions, classesDataSelector } from './_store/classes';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  classesData: classesDataSelector(state),
  user: authUserSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addClass: (classs: Partial<IClass>) => dispatch(classesActions.addClass(classs)),
  updateClass: (id: number, classs: Partial<IClass>) =>
    dispatch(classesActions.updateClass(id, classs)),
  resetPhase: () => dispatch(classesActions.setPhase(null))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: () => void;
};

const ClassForm = (props: TFormProps) => {
  const { id } = useParams();
  const {
    actionType,
    sideForm,
    handleClose,
    activeSchool,
    classesData,
    addClass,
    updateClass,
    resetPhase
  } = props;
  const { classes, phase } = classesData;
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const classEdit = (id && classes.find((p) => p.id === parseInt(id))) || null;

  const initialFormValues: Partial<IClass> = {
    title: (actionType === 'new' && '') || classEdit?.title || ''
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
  const validateForm = (values: Partial<IClass>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['title'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IClass>) => {
    if (values !== initialValues) {
      setStatus('submitted');
      setSubmitting(true);

      if (actionType === 'add') {
        const classAdd: Partial<IClass> = {
          title: values.title,
          school: activeSchool.id
        };
        // Add the class
        addClass(classAdd);
      } else {
        updateClass(parseInt(id), values);
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
              id='title'
              autoFocus
              className={`${errors.title ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.title ? errors.title : ''}
              error={!!errors.title}
              fullWidth={true}
              label={intl.translate({ id: 'class.title' })}
              value={values.title}
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

export default connector(ClassForm);
