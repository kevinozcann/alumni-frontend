import { Box, Divider, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';

import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { ISchool } from 'pages/organization/organization-types';
import { authUserSelector } from 'pages/auth/services/store/auth';
import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector } from 'pages/profile/services/user';
import { CancelButton, FormButtons, SaveButton } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';

import {
  IStudentTag,
  studentTagsActions,
  studentTagsPhaseSelector,
  studentTagsSelector
} from './_store/tags';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  studentTags: studentTagsSelector(state),
  phase: studentTagsPhaseSelector(state),
  user: authUserSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addStudentTag: (activeSchool: ISchool, studentTagInfo: Partial<IStudentTag>) =>
    dispatch(studentTagsActions.addStudentTag(activeSchool, studentTagInfo)),
  updateStudentTag: (studentTagInfo: Partial<IStudentTag>) =>
    dispatch(studentTagsActions.updateStudentTag(studentTagInfo))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: any;
};

const StudentTagsForm = (props: TFormProps) => {
  const { id } = useParams();
  const {
    actionType,
    sideForm,
    studentTags,
    phase,
    handleClose,
    activeSchool,
    user,
    addStudentTag,
    updateStudentTag
  } = props;
  const intl = useTranslation();

  const { showSnackbar } = useSnackbar();

  const studentTagInfo: IStudentTag = studentTags.find((g: IStudentTag) => g.id === parseInt(id));

  const initialFormValues: Partial<IStudentTag> = {
    id: (actionType === 'new' && null) || studentTagInfo?.id || null,
    tag: (actionType === 'new' && '') || studentTagInfo?.tag || '',
    hit: (actionType === 'new' && 0) || studentTagInfo?.hit || 0,
    addedBy: user['@id']
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
  const validateForm = (values: Partial<IStudentTag>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['tag'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IStudentTag>) => {
    setStatus('submitted');

    if (values !== initialValues) {
      setSubmitting(true);

      if (actionType === 'add') {
        addStudentTag(activeSchool, values);
      } else {
        updateStudentTag(values);
      }
    }
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

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
  }, [intl, showSnackbar, sideForm, status, phase, setSubmitting, handleClose]);

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
              id='tag'
              autoFocus
              className={`${errors.tag ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.tag ? errors.tag : ''}
              error={!!errors.tag}
              fullWidth={true}
              label={intl.translate({ id: 'student.tag' })}
              value={values.tag}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider />
        <FormButtons
          saveButton={<SaveButton />}
          cancelButton={<CancelButton onClick={handleClose} />}
        />
      </form>
    </Box>
  );
};

export default connector(StudentTagsForm);
