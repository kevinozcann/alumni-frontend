import React from 'react';
import { useParams } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { TextField, Switch, Grid, FormControlLabel, MenuItem, Divider, Box } from '@mui/material';
import { useFormik } from 'formik';

import { AppDispatch, RootState } from 'store/store';
import { configActions, configPhaseSelector, gradeLevelsSelector } from 'store/config';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { TActionType } from 'utils/shared-types';
import { SaveButton } from 'utils/ActionLinks';
import { arrayRange } from 'utils/Helpers';

import { IGradeLevel } from './grade-types';

const mapStateToProps = (state: RootState) => ({
  gradeLevels: gradeLevelsSelector(state),
  phase: configPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addGradeLevel: (gradeLevelInfo: Partial<IGradeLevel>) =>
    dispatch(configActions.addGradeLevel(gradeLevelInfo)),
  updateGradeLevel: (gradeLevelInfo: Partial<IGradeLevel>) =>
    dispatch(configActions.updateGradeLevel(gradeLevelInfo))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: any;
};

const GradeLevelsForm: React.FC<TFormProps> = (props) => {
  const { actionType, sideForm, gradeLevels, phase, handleClose, addGradeLevel, updateGradeLevel } =
    props;
  const { id } = useParams();
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const gradeLevelInfo: IGradeLevel = gradeLevels.find((g: IGradeLevel) => g.id === parseInt(id));

  const initialFormValues: Partial<IGradeLevel> = {
    id: (actionType === 'new' && null) || gradeLevelInfo?.id || null,
    gradeName: (actionType === 'new' && '') || gradeLevelInfo?.gradeName || '',
    gradeShortName: (actionType === 'new' && null) || gradeLevelInfo?.gradeShortName || null,
    gradeLevelNo: (actionType === 'new' && 0) || gradeLevelInfo?.gradeLevelNo || 0,
    tag: (actionType === 'new' && '') || gradeLevelInfo?.tag || '',
    active: (actionType === 'new' && true) || gradeLevelInfo?.active || true
  };
  const {
    handleSubmit,
    handleChange,
    setFieldValue,
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

  const validateForm = (values: Partial<IGradeLevel>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['gradeName'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IGradeLevel>) => {
    setStatus('submitted');

    if (values !== initialValues) {
      setSubmitting(true);

      if (actionType === 'add') {
        addGradeLevel(values);
      } else {
        updateGradeLevel(values);
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
          <Grid item xs={12} md={sideForm ? 12 : 6}>
            <TextField
              id='gradeName'
              autoFocus
              className={`${errors.gradeName ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.gradeName ? errors.gradeName : ''}
              error={!!errors.gradeName}
              fullWidth={true}
              label={intl.translate({ id: 'school.grade' })}
              value={values.gradeName}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={sideForm ? 12 : 6}>
            <TextField
              id='gradeShortName'
              className={`${errors.gradeShortName ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.gradeShortName ? errors.gradeShortName : ''}
              error={!!errors.gradeShortName}
              fullWidth={true}
              label={intl.translate({ id: 'abbreviation' })}
              value={values.gradeShortName}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={sideForm ? 12 : 6}>
            <TextField
              id='gradeLevelNo'
              select={true}
              className={`${errors.gradeLevelNo ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.gradeLevelNo ? errors.gradeLevelNo : ''}
              error={!!errors.gradeLevelNo}
              fullWidth={true}
              label={intl.translate({ id: 'school.grade' })}
              value={values.gradeLevelNo}
              variant='outlined'
              onChange={(event) => setFieldValue('gradeLevelNo', event.target.value)}
            >
              {arrayRange(3, 45).map((level) => (
                <MenuItem key={level} value={level} dense={true}>
                  {`${level} ${intl.translate({ id: 'calendar.year' })}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={sideForm ? 12 : 6}>
            <TextField
              id='tag'
              className={`${errors.tag ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.tag ? errors.tag : ''}
              error={!!errors.tag}
              fullWidth={true}
              label={intl.translate({ id: 'tag' })}
              value={values.tag}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={sideForm ? 12 : 6}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!values.active}
                  color='primary'
                  disabled={isSubmitting ? true : false}
                  id='active'
                  onChange={handleChange}
                />
              }
              label={intl.translate({ id: 'app.is_active' })}
            />
          </Grid>

          <Grid item xs={12} md={6}></Grid>
        </Grid>

        <Divider sx={{ mx: -2 }} />

        <Box sx={{ p: 0, pt: 2 }}>
          <SaveButton mode={isSubmitting ? 'saving' : ''} />
        </Box>
      </form>
    </Box>
  );
};

export default connector(GradeLevelsForm);
