import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { Box, Grid, TextField, Stepper, Step, StepButton, Button, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { SaveButton } from 'utils/ActionLinks';
import { TActionType } from 'utils/shared-types';
import { personsSelector, personsPhaseSelector, IPerson, personActions } from '../services/persons';

const mapStateToProps = (state: RootState) => ({
  persons: personsSelector(state),
  phase: personsPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addPerson: (person: Partial<IPerson>) => dispatch(personActions.addPerson(person)),
  updatePerson: (person: Partial<IPerson>) => dispatch(personActions.updatePerson(person))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  actionType: TActionType;
  sideForm?: boolean;
  handleClose?: any;
};

const PersonForm = (props: TFormProps) => {
  const { id } = useParams();
  const { actionType, sideForm, persons, phase, handleClose, addPerson, updatePerson } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompleted] = React.useState<{ [k: number]: boolean }>({});
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const personInfo: IPerson = persons.find((g: IPerson) => g.id === id);

  const initialValues: Partial<IPerson> = {
    id: (actionType === 'new' && null) || personInfo?.id || null,
    ssn_number: (actionType === 'new' && '') || personInfo?.ssn_number || '',
    school_number: (actionType === 'new' && '') || personInfo?.school_number || '',
    name: (actionType === 'new' && '') || personInfo?.name || '',
    second_name: (actionType === 'new' && '') || personInfo?.second_name || '',
    last_name: (actionType === 'new' && '') || personInfo?.last_name || '',
    gender: (actionType === 'new' && '') || personInfo?.gender || '',
    student_picture: (actionType === 'new' && '') || personInfo?.student_picture || '',
    occupation: (actionType === 'new' && '') || personInfo?.occupation || '',
    graduation_period: (actionType === 'new' && '') || personInfo?.graduation_period || '',
    graduation_status: (actionType === 'new' && '') || personInfo?.graduation_status || '',
    education_status: (actionType === 'new' && '') || personInfo?.education_status || '',
    marital_status: (actionType === 'new' && '') || personInfo?.marital_status || '',
    phone_number: (actionType === 'new' && '') || personInfo?.phone_number || '',
    email: (actionType === 'new' && '') || personInfo?.email || '',
    linkedin_url: (actionType === 'new' && '') || personInfo?.linkedin_url || '',
    twitter_url: (actionType === 'new' && '') || personInfo?.twitter_url || '',
    facebook_url: (actionType === 'new' && '') || personInfo?.facebook_url || ''
  };

  const {
    handleSubmit,
    handleChange,
    setFieldValue,
    values,
    errors,
    setErrors,
    isSubmitting,
    setSubmitting,
    status,
    setStatus
  } = useFormik({
    initialValues: initialValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });

  const validateForm = (values: Partial<IPerson>) => {
    const errors = {};
    if (activeStep === 0) {
      const nonEmptyFields = ['name', 'last_name'];

      nonEmptyFields.forEach((field) => {
        if (!values[field]) {
          errors[field] = intl.formatMessage({ id: 'app.cannot_be_empty' });
        }
      });
    }

    return errors;
  };

  const submitForm = (values: Partial<IPerson>) => {
    setStatus('submitted');

    if (values !== initialValues) {
      setSubmitting(true);

      if (actionType === 'add') {
        addPerson(values);
      } else {
        updatePerson(values);
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

  const handleBack = () => {
    const newCompletedSteps = completedSteps;
    newCompletedSteps[activeStep] = false;
    newCompletedSteps[activeStep - 1] = false;
    setCompleted(newCompletedSteps);

    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newCompletedSteps = completedSteps;
    newCompletedSteps[activeStep] = true;
    setCompleted(newCompletedSteps);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <form
        style={{ width: '100%' }}
        className='form'
        noValidate={true}
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <Stepper sx={{ my: 2 }} activeStep={activeStep}>
          <Step key='general' completed={completedSteps[0]}>
            <StepButton color='inherit'>{intl.formatMessage({ id: 'school.general' })}</StepButton>
          </Step>
          <Step key='grades' completed={completedSteps[2]}>
            <StepButton color='inherit'>{intl.formatMessage({ id: 'school.info' })}</StepButton>
          </Step>
          <Step key='config' completed={completedSteps[3]}>
            <StepButton color='inherit'>
              {intl.formatMessage({ id: 'communication.info' })}
            </StepButton>
          </Step>
        </Stepper>
        <Box sx={{ mt: 4 }}>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
                <TextField
                  id='second_name'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.secondname' })}
                  value={values.second_name}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id='last_name'
                  className={`${errors.last_name ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.last_name ? errors.last_name : ''}
                  error={!!errors.last_name}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.lastname' })}
                  value={values.last_name}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label={intl.translate({ id: 'date_of_birth' })}
                  value={values.birth_date}
                  onChange={(value) => setFieldValue('birth_date', value)}
                  renderInput={(params) => <TextField id='birth_date' fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='gender'
                  select={true}
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'gender' })}
                  value={values.gender}
                  variant='outlined'
                  onChange={(event) => setFieldValue('gender', event.target.value)}
                >
                  <MenuItem key='1' value='MALE' dense={true}>
                    {`${intl.translate({ id: 'person.male' })}`}
                  </MenuItem>
                  <MenuItem key='2' value='FEMAIL' dense={true}>
                    {`${intl.translate({ id: 'person.female' })}`}
                  </MenuItem>
                  <MenuItem key='3' value='OTHER' dense={true}>
                    {`${intl.translate({ id: 'other' })}`}
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='occupation'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.occupation' })}
                  value={values.occupation}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='marital_status'
                  select={true}
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.marital_status' })}
                  value={values.marital_status}
                  variant='outlined'
                  onChange={(event) => setFieldValue('marital_status', event.target.value)}
                >
                  <MenuItem key='1' value='SINGLE' dense={true}>
                    {`${intl.translate({ id: 'person.single' })}`}
                  </MenuItem>
                  <MenuItem key='2' value='MARRIED' dense={true}>
                    {`${intl.translate({ id: 'person.married' })}`}
                  </MenuItem>
                  <MenuItem key='3' value='SEPARATED' dense={true}>
                    {`${intl.translate({ id: 'person.separated' })}`}
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  id='graduation_period'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.graduation_period' })}
                  value={values.graduation_period}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='graduation_status'
                  select={true}
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.school' })}
                  value={values.graduation_status}
                  variant='outlined'
                  onChange={(event) => setFieldValue('graduation_status', event.target.value)}
                >
                  <MenuItem key='1' value='gkv_primary' dense={true}>
                    {'GAZİANTEP KOLEJ VAKFI ÖZEL İLKOKULU'}
                  </MenuItem>
                  <MenuItem key='2' value='gkv_secondary' dense={true}>
                    {'GAZİANTEP KOLEJ VAKFI ÖZEL ORTAOKULU'}
                  </MenuItem>
                  <MenuItem key='3' value='gkv_anatolian_high_school' dense={true}>
                    {'GAZİANTEP KOLEJ VAKFI ÖZEL ANADOLU LİSESİ'}
                  </MenuItem>
                  <MenuItem key='4' value='gkv_science_high_school' dense={true}>
                    {'GAZİANTEP KOLEJ VAKFI ÖZEL FEN LİSESİ'}
                  </MenuItem>
                  <MenuItem key='5' value='gkv_cemil_alevli_college' dense={true}>
                    {'GAZİANTEP KOLEJ VAKFI ÖZEL OKULLARI CEMİL ALEVLİ KOLEJİ'}
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  id='education_status'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.education_status' })}
                  value={values.education_status}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  id='phone_number'
                  autoFocus
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'user.phone_number' })}
                  value={values.phone_number}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='email'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.email' })}
                  value={values.email}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  id='linkedin_url'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.linkedin' })}
                  value={values.linkedin_url}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id='twitter_url'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.twitter' })}
                  value={values.twitter_url}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id='facebook_url'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.facebook' })}
                  value={values.facebook_url}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          )}
        </Box>
        <Box sx={{ mt: 3 }}>
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button disabled={activeStep === 0} color='inherit' onClick={handleBack}>
                {intl.formatMessage({ id: 'app.back' })}
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              {activeStep === 2 && <SaveButton />}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                disabled={activeStep === 2 || Object.keys(errors).length > 0}
                onClick={handleComplete}
              >
                {intl.formatMessage({ id: 'app.next' })}
              </Button>
            </Box>
          </React.Fragment>
        </Box>
      </form>
    </Box>
  );
};

export default connector(PersonForm);
