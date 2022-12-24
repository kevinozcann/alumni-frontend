import React from 'react';
import { useParams } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { useFormik } from 'formik';
import { Box, Grid, TextField } from '@mui/material';
//import { DatePicker } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';

import { AppDispatch, RootState } from 'store/store';
import { authUserSelector } from 'pages/auth/services/store/auth';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'pages/profile/services/user';
import { i18nLangSelector } from 'store/i18n';
import { configActions, configPhaseSelector } from 'store/config';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { FormButtons, SaveButton } from 'utils/ActionLinks';
import { TLang } from 'utils/shared-types';
import { IUser } from 'pages/auth/data/account-types';
import { IGradingTerm, ISeason } from 'pages/organization/organization-types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  configPhase: configPhaseSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addGradingTerm: (lang: TLang, user: IUser, gradingTermInfo: Partial<IGradingTerm>) =>
    dispatch(configActions.addGradingTerm(lang, user, gradingTermInfo)),
  updateGradingTerm: (lang: TLang, user: IUser, gradingTermInfo: Partial<IGradingTerm>) =>
    dispatch(configActions.updateGradingTerm(lang, user, gradingTermInfo)),
  resetPhase: () => dispatch(configActions.setPhase(null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAddSeasonProps = PropsFromRedux & {
  gradingTerms?: IGradingTerm[];
  handleClose?: () => void;
};

const GradingTermForm = (props: TAddSeasonProps) => {
  const {
    lang,
    user,
    gradingTerms,
    configPhase,
    activeSeason,
    addGradingTerm,
    updateGradingTerm,
    resetPhase,
    handleClose
  } = props;
  const { gid } = useParams();
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const gradingTermInfo = gid ? gradingTerms.find((g) => g.id === parseInt(gid)) : null;

  const initialValues: Partial<IGradingTerm> = {
    id: gradingTermInfo?.id || null,
    title: gradingTermInfo?.title || '',
    startDate: gradingTermInfo?.startDate || null,
    endDate: gradingTermInfo?.endDate || null,
    season: `/api/seasons/${activeSeason.id}`
  };

  const {
    handleSubmit,
    handleChange,
    setFieldValue,
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
  const validateForm = (values: Partial<ISeason>) => {
    const errors: { [key: string]: any } = {};
    const nonEmptyFields = ['title', 'startDate', 'endDate'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<ISeason>) => {
    setStatus('submitted');

    if (values.id) {
      // updateGradingTerm(lang, user, values);
    } else {
      // addGradingTerm(lang, user, values);
    }
  };

  React.useEffect(() => {
    if (status === 'submitted' && configPhase === 'success') {
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
  }, [status, configPhase]);

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
        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              className={`${errors.title ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.title ? errors.title : ''}
              error={!!errors.title}
              fullWidth={true}
              id='title'
              label={intl.formatMessage({ id: 'season.title' })}
              margin='normal'
              onChange={handleChange}
              value={values.title}
              variant='outlined'
            />
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} md={6}>
            <DatePicker
              label={intl.translate({ id: 'app.date.start.date' })}
              value={values.startDate}
              onChange={(value) => setFieldValue('startDate', value)}
              renderInput={(params) => <TextField id='startDate' fullWidth {...params} />}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={12} md={6}>
            <DatePicker
              label={intl.translate({ id: 'app.date.end.date' })}
              value={values.endDate}
              onChange={(value) => setFieldValue('endDate', value)}
              renderInput={(params) => <TextField id='endDate' fullWidth {...params} />}
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

export default connector(GradingTermForm);
