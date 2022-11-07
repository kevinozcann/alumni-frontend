import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { Box, Grid, TextField } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { SaveButton, CancelButton } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';

import {
  classTypesSelector,
  classTypesPhaseSelector,
  classTypesActions,
  IClassType
} from './_store/classTypes';

const mapStateToProps = (state: RootState) => ({
  classTypes: classTypesSelector(state),
  phase: classTypesPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addClassType: (classTypeInfo: Partial<IClassType>) =>
    dispatch(classTypesActions.addClassType(classTypeInfo)),
  updateClassType: (classTypeInfo: Partial<IClassType>) =>
    dispatch(classTypesActions.updateClassType(classTypeInfo))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: any;
};

const ClassTypesForm: React.FC<TFormProps> = (props) => {
  const { actionType, sideForm, classTypes, phase, handleClose, addClassType, updateClassType } =
    props;
  const { id } = useParams();
  const intl = useTranslation();

  const { showSnackbar } = useSnackbar();

  const classTypeInfo: IClassType = classTypes.find((g: IClassType) => g.id === parseInt(id));

  const initialFormValues: Partial<IClassType> = {
    id: (actionType === 'new' && null) || classTypeInfo?.id || null,
    title: (actionType === 'new' && '') || classTypeInfo?.title || '',
    bgcolor: (actionType === 'new' && '') || classTypeInfo?.bgcolor || ''
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
  const validateForm = (values: Partial<IClassType>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['title'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IClassType>) => {
    setStatus('submitted');

    if (values !== initialValues) {
      setSubmitting(true);

      if (actionType === 'add') {
        addClassType(values);
      } else {
        updateClassType(values);
      }
    }
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, []);

  React.useEffect(() => {
    setSubmitting(false);

    if (status === 'submitted' && phase === 'success') {
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
  }, [status, phase, setSubmitting, handleClose]);

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
          <Grid item xs={12} md={12}>
            <TextField
              id='title'
              autoFocus
              className={`${errors.title ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.title ? errors.title : ''}
              error={!!errors.title}
              fullWidth={true}
              label={intl.translate({ id: 'class.type.title' })}
              value={values.title}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 0, pt: 2 }}>
          <SaveButton />
          <CancelButton onClick={handleClose} />
        </Box>
      </form>
    </Box>
  );
};

export default connector(ClassTypesForm);
