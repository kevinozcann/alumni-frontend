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
    ssnNumber: (actionType === 'new' && '') || personInfo?.ssnNumber || '',
    schoolNumber: (actionType === 'new' && '') || personInfo?.schoolNumber || '',
    name: (actionType === 'new' && '') || personInfo?.name || '',
    secondName: (actionType === 'new' && '') || personInfo?.secondName || '',
    lastName: (actionType === 'new' && '') || personInfo?.lastName || '',
    //birthDate: (actionType === 'new' && '') || personInfo?.birthDate || '',
    gender: (actionType === 'new' && '') || personInfo?.gender || '',
    studentPicture: (actionType === 'new' && '') || personInfo?.studentPicture || '',
    occupation: (actionType === 'new' && '') || personInfo?.occupation || '',
    graduationPeriod: (actionType === 'new' && '') || personInfo?.graduationPeriod || '',
    graduationStatus: (actionType === 'new' && '') || personInfo?.graduationStatus || '',
    educationStatus: (actionType === 'new' && '') || personInfo?.educationStatus || '',
    maritalStatus: (actionType === 'new' && '') || personInfo?.maritalStatus || '',
    phoneNumber: (actionType === 'new' && '') || personInfo?.phoneNumber || '',
    email: (actionType === 'new' && '') || personInfo?.email || '',
    linkedinUrl: (actionType === 'new' && '') || personInfo?.linkedinUrl || '',
    twitterUrl: (actionType === 'new' && '') || personInfo?.twitterUrl || '',
    facebookUrl: (actionType === 'new' && '') || personInfo?.facebookUrl || ''
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
      const nonEmptyFields = ['name', 'lastName'];

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
                  id='secondName'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.secondname' })}
                  value={values.secondName}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id='lastName'
                  className={`${errors.lastName ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                  disabled={isSubmitting ? true : false}
                  helperText={errors.lastName ? errors.lastName : ''}
                  error={!!errors.lastName}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.lastname' })}
                  value={values.lastName}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id='ssnNumber'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'id_number' })}
                  value={values.ssnNumber}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label={intl.translate({ id: 'date_of_birth' })}
                  value={values.birthDate}
                  onChange={(value) => setFieldValue('birthDate', value)}
                  renderInput={(params) => <TextField id='birthDate' fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
                  id='maritalStatus'
                  select={true}
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.marital_status' })}
                  value={values.maritalStatus}
                  variant='outlined'
                  onChange={(event) => setFieldValue('maritalStatus', event.target.value)}
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
                  id='schoolNumber'
                  autoFocus
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'student.no' })}
                  value={values.schoolNumber}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id='graduationPeriod'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.graduation_period' })}
                  value={values.graduationPeriod}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id='graduationStatus'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.graduation_status' })}
                  value={values.graduationStatus}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id='educationStatus'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.education_status' })}
                  value={values.educationStatus}
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
                  id='phoneNumber'
                  autoFocus
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'user.phone_number' })}
                  value={values.phoneNumber}
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
                  id='linkedinUrl'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.linkedin' })}
                  value={values.linkedinUrl}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id='twitterUrl'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.twitter' })}
                  value={values.twitterUrl}
                  variant='outlined'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id='facebookUrl'
                  disabled={isSubmitting ? true : false}
                  fullWidth={true}
                  label={intl.translate({ id: 'person.facebook' })}
                  value={values.facebookUrl}
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
        {/*<FormButtons saveButton={<SaveButton />} cancelButton={<CancelButton />} />*/}
      </form>
    </Box>
  );
};

export default connector(PersonForm);
