import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormik } from 'formik';
import {
  TextField,
  Grid,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stepper,
  Step,
  StepButton,
  Button
} from '@mui/material';

import { timezones } from 'data';
import { AppDispatch, RootState } from 'store/store';
import { countriesSelector, staticActions } from 'store/static';
import { configActions, gradeLevelsSelector } from 'store/config';
import { i18nLangSelector } from 'store/i18n';
import { authUserSelector } from 'pages/auth/services/auth';
import { userActiveSchoolSelector } from 'pages/profile/services/user';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { ICountry, TLang } from 'utils/shared-types';
import { SaveButton } from 'utils/ActionLinks';
import { countryToFlag } from 'utils/Helpers';
import { IUser } from 'pages/auth/data/account-types';

import { TSchoolType } from '../organization-types';
import { schoolActions, schoolPhaseSelector } from '../_store/school';
import GradesForm from '../view/ViewGrades';
import { useNavigate } from 'react-router';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  countries: countriesSelector(state),
  gradeLevels: gradeLevelsSelector(state),
  schoolPhase: schoolPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullCountries: () => dispatch(staticActions.pullCountries()),
  pullGradeLevels: () => dispatch(configActions.pullGradeLevels(true)),
  addSchool: (user: IUser, lang: TLang, values: TSchoolFormValues) =>
    dispatch(schoolActions.addSchool(user, lang, values))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TSchoolFormProps = PropsFromRedux;

export type TSchoolFormValues = {
  title: string;
  email: string;
  countryCode: string;
  isActive: boolean;
  grades: number[];
  parentSchoolId: number;
  schoolType: TSchoolType;
  institutionType: string;
  timezone: string;
  language: string;
  config: Record<string, string>;
};

const AddSchool = (props: TSchoolFormProps) => {
  const {
    user,
    lang,
    activeSchool,
    countries,
    gradeLevels,
    schoolPhase,
    pullCountries,
    pullGradeLevels,
    addSchool
  } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompleted] = React.useState<{ [k: number]: boolean }>({});
  const intl = useTranslation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const initialValues: TSchoolFormValues = {
    title: '',
    email: '',
    countryCode: activeSchool.countryCode,
    isActive: true,
    grades: [],
    parentSchoolId: activeSchool.id,
    schoolType: activeSchool.type === 'headquarters' ? 'campus' : 'school',
    institutionType: (activeSchool.config?.institutionType as string) || 'k12',
    timezone: (activeSchool.config?.timezone as string) || 'America/New_York',
    language: (activeSchool.config.language as string) || 'en',
    config: activeSchool.config
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

  const validateForm = (values: TSchoolFormValues) => {
    const errors = {};
    if (activeStep === 0) {
      const nonEmptyFields = ['title', 'email', 'countryCode'];

      nonEmptyFields.forEach((field) => {
        if (!values[field]) {
          errors[field] = intl.formatMessage({ id: 'app.cannot_be_empty' });
        }
      });
    }
    // if (activeStep === 1) {
    //   if (values.seasons.length === 0) {
    //     errors['seasons'] = intl.formatMessage({ id: 'app.no_row_selected' });
    //   }
    // }
    if (activeStep === 2) {
      if (values.grades.length === 0) {
        const gradesTrans = intl.formatMessage({ id: 'school.grade' });
        errors['grades'] = intl.formatMessage(
          { id: 'app.no_record_selected' },
          { name: gradesTrans }
        );
      }
    }

    return errors;
  };

  const submitForm = (values: TSchoolFormValues) => {
    setStatus('submitted');

    // addSchool(user, lang, values);
  };

  // const handleSeasonClick = (event: React.ChangeEvent<HTMLInputElement>, season: ISeason) => {
  //   const isChecked = event.target.checked;

  //   let newValue = [...values.seasons];
  //   if (isChecked) {
  //     newValue.push(season);
  //   } else {
  //     newValue = values.seasons?.filter((n) => n.id !== season.id);
  //   }
  //   setFieldValue('seasons', newValue);
  // };

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

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  React.useEffect(() => {
    if (schoolPhase === 'school-adding-success') {
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.formatMessage({ id: 'app.saved' }),
          open: true
        });

        setTimeout(() => {
          navigate(
            `/organization/${activeSchool.id}/${
              (activeSchool.type === 'headquarters' && 'campuses') || 'schools'
            }`
          );
        }, 1000);
      }
    }
  }, [schoolPhase]);

  React.useEffect(() => {
    if (countries?.length === 0) {
      pullCountries();
    }
    // if (seasons?.length === 0) {
    //   pullSeasons();
    // }
    if (gradeLevels?.length === 0) {
      pullGradeLevels();
    }
  }, []);

  return (
    <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
      <Stepper sx={{ my: 2 }} activeStep={activeStep}>
        <Step key='general' completed={completedSteps[0]}>
          <StepButton color='inherit'>{intl.formatMessage({ id: 'school.general' })}</StepButton>
        </Step>
        {/* <Step key='seasons' completed={completedSteps[1]}>
          <StepButton color='inherit'>{intl.formatMessage({ id: 'school.seasons' })}</StepButton>
        </Step> */}
        <Step key='grades' completed={completedSteps[2]}>
          <StepButton color='inherit'>{intl.formatMessage({ id: 'school.grades' })}</StepButton>
        </Step>
        <Step key='config' completed={completedSteps[3]}>
          <StepButton color='inherit'>{intl.formatMessage({ id: 'school.config' })}</StepButton>
        </Step>
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                className={`${errors.title ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                disabled={isSubmitting ? true : false}
                helperText={errors.title ? errors.title : ''}
                error={!!errors.title}
                fullWidth={true}
                id='title'
                label={intl.formatMessage({ id: 'school.offical_name' })}
                margin='normal'
                onChange={handleChange}
                value={values.title}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                className={`${errors.email ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                disabled={isSubmitting ? true : false}
                helperText={errors.email ? errors.email : ''}
                error={!!errors.email}
                fullWidth={true}
                id='email'
                label={intl.translate({ id: 'school.config.email' })}
                margin='normal'
                onChange={handleChange}
                value={values.email}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                id='countryCode'
                options={(countries && countries) || []}
                autoHighlight
                value={countries?.find(
                  (c) => c.isoCode?.toString() === values.countryCode?.toString()
                )}
                onChange={(_e, value: ICountry) =>
                  setFieldValue('countryCode', value?.isoCode || '')
                }
                // getOptionLabel={(option) => `${countryToFlag(option.isoCode)} ${option.country}`}
                renderOption={(props, option: ICountry) => (
                  <li {...props}>
                    <span style={{ marginRight: 10, fontSize: 18 }}>
                      {countryToFlag(option.isoCode)}
                    </span>
                    {option.country} ({option.isoCode})
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={`${
                      errors.countryCode ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                    }`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.countryCode ? errors.countryCode : ''}
                    error={!!errors.countryCode}
                    value={countries?.find(
                      (c) => c.isoCode?.toString() === values.countryCode?.toString()
                    )}
                    label={intl.formatMessage({ id: 'app.country' })}
                    variant='outlined'
                    fullWidth={true}
                    margin='normal'
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password' // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
        {/* {activeStep === 1 && (
          <SeasonsForm
            seasons={seasons}
            values={{ seasons: values?.seasons }}
            errors={errors}
            isSubmitting={isSubmitting}
            handleChangeCheckbox={handleSeasonClick}
          />
        )} */}
        {activeStep === 2 && (
          <GradesForm
            gradeLevels={gradeLevels}
            countryCode={values.countryCode}
            values={values}
            errors={errors}
            setFieldValue={setFieldValue}
          />
        )}
        {activeStep === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                id='config.timezone'
                sx={{
                  flexGrow: 1,
                  '& .MuiAutocomplete-option': {
                    fontSize: 15,
                    '& > span': {
                      marginRight: 10,
                      fontSize: 18
                    }
                  }
                }}
                options={timezones}
                autoHighlight
                value={values.timezone}
                onChange={(e, value) => setFieldValue('timezone', value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    disabled={isSubmitting}
                    value={values.timezone}
                    label={intl.formatMessage({ id: `school.config.timezone` })}
                    variant='outlined'
                    margin='normal'
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password' // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id='config.institutionType-label'>
                  {intl.formatMessage({ id: 'school.config.institutionType' })}
                </InputLabel>
                <Select
                  fullWidth
                  id='config.institutionType'
                  labelId='config.institutionType-label'
                  label={intl.formatMessage({ id: 'school.config.institutionType' })}
                  value={values.institutionType}
                  variant='outlined'
                  onChange={(event) => setFieldValue('institutionType', event.target.value)}
                >
                  <MenuItem value='kindergarten' disabled>
                    Kindergarten
                  </MenuItem>
                  <MenuItem value='k12'>K12</MenuItem>
                  <MenuItem value='academy'>{intl.formatMessage({ id: 'academy' })}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id='config.language-label'>
                  {intl.formatMessage({ id: 'school.config.language' })}
                </InputLabel>
                <Select
                  fullWidth
                  id='config.language'
                  labelId='config.language-label'
                  label={intl.formatMessage({ id: 'school.config.language' })}
                  value={values.language}
                  variant='outlined'
                  onChange={(event) => setFieldValue('language', event.target.value)}
                >
                  <MenuItem value='tr'>Türkçe</MenuItem>
                  <MenuItem value='en'>English</MenuItem>
                </Select>
              </FormControl>
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
            {activeStep === 3 && <SaveButton mode={isSubmitting ? 'saving' : ''} />}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              disabled={activeStep === 3 || Object.keys(errors).length > 0}
              onClick={handleComplete}
            >
              {intl.formatMessage({ id: 'app.next' })}
            </Button>
          </Box>
        </React.Fragment>
      </Box>
    </form>
  );
};

export default connector(AddSchool);
