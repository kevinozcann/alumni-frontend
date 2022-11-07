import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { Autocomplete, Box, Grid, MenuItem, TextField } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import addMinutes from 'date-fns/addMinutes';

import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'store/user';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { CancelButton, FormButtons, SaveButton } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';
import { IClass, IOnlineClass } from 'pages/classes/_store/types';
import { classesActions, classesDataSelector } from 'pages/classes/classes/_store/classes';
import { ISchool } from 'pages/organization/organization-types';
import {
  personnelActions,
  personnelDataSelector
} from 'pages/personnel/personnel/_store/personnel';
import { IPerson } from 'pages/personnel/_store/types';

import { onlineClassesActions, onlineClassesDataSelector } from './_store/onlineClasses';

const mapStateToProps = (state: RootState) => ({
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  classesData: classesDataSelector(state),
  onlineClassesData: onlineClassesDataSelector(state),
  personnelData: personnelDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addOnlineClass: (onlineClassInfo: Partial<IOnlineClass>) =>
    dispatch(onlineClassesActions.addOnlineClass(onlineClassInfo)),
  updateOnlineClass: (id: number, onlineClassInfo: Partial<IOnlineClass>) =>
    dispatch(onlineClassesActions.updateOnlineClass(id, onlineClassInfo)),
  pullClasses: (school: Partial<ISchool>) => dispatch(classesActions.pullClasses(school)),
  pullPersonnel: (school: Partial<ISchool>) => dispatch(personnelActions.pullPersonnel(school)),
  resetPhase: () => dispatch(onlineClassesActions.setPhase(null))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: () => void;
};

const OnlineClassForm = (props: TFormProps) => {
  const { id } = useParams();
  const {
    actionType,
    sideForm,
    handleClose,
    activeSchool,
    activeSeason,
    classesData,
    onlineClassesData,
    personnelData,
    addOnlineClass,
    updateOnlineClass,
    pullClasses,
    pullPersonnel,
    resetPhase
  } = props;
  const { onlineClasses, phase } = onlineClassesData;
  const { classes } = classesData;
  const { personnel } = personnelData;

  const intl = useTranslation();

  const { showSnackbar } = useSnackbar();

  const onlineClassInfo: IOnlineClass = onlineClasses.find((g) => g.id === parseInt(id));

  const timeNow = new Date();
  const initialFormValues: Partial<IOnlineClass> = {
    id: (actionType === 'new' && null) || onlineClassInfo?.id || null,
    title: (actionType === 'new' && '') || onlineClassInfo?.title || '',
    description: (actionType === 'new' && '') || onlineClassInfo?.description || '',
    class: (actionType === 'new' && 0) || onlineClassInfo?.class || 0,
    teacher: (actionType === 'new' && 0) || onlineClassInfo?.teacher || 0,
    startsAt: (actionType === 'new' && timeNow) || onlineClassInfo?.startsAt || timeNow,
    duration: (actionType === 'new' && 60) || onlineClassInfo?.duration || 60
  };

  const {
    handleSubmit,
    handleChange,
    values,
    initialValues,
    errors,
    isSubmitting,
    setFieldValue,
    setSubmitting,
    status,
    setStatus
  } = useFormik({
    initialValues: initialFormValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });
  const validateForm = (values: Partial<IOnlineClass>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['startsAt'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<IOnlineClass>) => {
    if (values !== initialValues) {
      setStatus('submitted');
      setSubmitting(true);

      const endsAt = addMinutes(values.startsAt, values.duration);
      if (actionType === 'add') {
        const classAdd: Partial<IOnlineClass> = Object.assign(values, {
          endsAt,
          season: `/api/seasons/${activeSeason.id}`,
          school: `/api/schools/${activeSchool.id}`
        });
        // Add the class
        addOnlineClass(classAdd);
      } else {
        const classEdit: Partial<IOnlineClass> = Object.assign(values, {
          endsAt
        });
        updateOnlineClass(parseInt(id), classEdit);
      }
    }
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('duration', event.target.value);
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

  React.useEffect(() => {
    if (classes.length === 0) {
      pullClasses(activeSchool);
    }
    if (personnel.length === 0) {
      pullPersonnel(activeSchool);
    }
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
          {/* Title */}
          <Grid item xs={12} md={6}>
            <TextField
              id='title'
              autoFocus
              className={`${errors.title ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors?.title || ''}
              error={!!errors.title}
              fullWidth={true}
              label={intl.translate({ id: 'online.class.title' })}
              value={values.title}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12} md={6}>
            <TextField
              id='description'
              className={`${errors.description ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors?.description || ''}
              error={!!errors.description}
              fullWidth={true}
              label={intl.translate({ id: 'online.class.description' })}
              value={values.description}
              variant='outlined'
              onChange={handleChange}
            />
          </Grid>

          {/* Class */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              id='class'
              options={classes || []}
              autoHighlight
              fullWidth
              value={classes?.find((c) => c.id === values.class)}
              onChange={(_e, value: IClass) => setFieldValue('class', value?.id || 0)}
              // getOptionLabel={(option) => option?. || ''}
              renderOption={(props, option: IClass) => <li {...props}>{option.title}</li>}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={`${errors.class ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.class || ''}
                  label={intl.translate({ id: 'online.class.class' })}
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete and autofill
                  }}
                />
              )}
            />
          </Grid>

          {/* Teacher */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              id='teacher'
              options={personnel || []}
              autoHighlight
              fullWidth
              value={personnel?.find((p) => p.id === values.teacher)}
              onChange={(_e, value: IPerson) => setFieldValue('teacher', value?.id)}
              // getOptionLabel={(option) => option?.fullname || ''}
              renderOption={(props, option: IPerson) => <li {...props}>{option.fullname}</li>}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={`${errors.teacher ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.teacher || ''}
                  label={intl.translate({ id: 'online.class.teacher' })}
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete and autofill
                  }}
                />
              )}
            />
          </Grid>

          {/* Start Datetime */}
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label={intl.translate({ id: 'app.date.start.datetime' })}
              value={values.startsAt}
              onChange={(value) => setFieldValue('startsAt', value)}
              renderInput={(params) => <TextField id='startsAt' fullWidth {...params} />}
            />
          </Grid>

          {/* Duration */}
          <Grid item xs={12} md={6}>
            <TextField
              id='duration'
              select
              className={`${errors.duration ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors?.duration || ''}
              error={!!errors.duration}
              fullWidth
              label={intl.translate({ id: 'online.class.duration' })}
              value={values.duration}
              variant='outlined'
              onChange={handleDurationChange}
            >
              {[15, 30, 45, 60].map((d) => (
                <MenuItem key={d} value={d}>
                  {intl.translate({ id: 'app.date.x.min' }, { x: d })}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

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

export default connector(OnlineClassForm);
