import React from 'react';
import { useParams } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { useFormik } from 'formik';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  TextField
} from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import { authUserSelector } from 'store/auth';
import { userActiveSchoolSelector } from 'store/user';
import { i18nLangSelector } from 'store/i18n';
import { configActions, configPhaseSelector } from 'store/config';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { FormButtons, SaveButton } from 'utils/ActionLinks';
import { TLang } from 'utils/shared-types';

import { IUser } from 'pages/account/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';
import { databaseDataSelector, databasesActions } from 'pages/admin/databases/_store/database';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  databaseData: databaseDataSelector(state),
  configPhase: configPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullDatabases: () => dispatch(databasesActions.pullDatabases()),
  addSeason: (
    lang: TLang,
    user: IUser,
    seasonInfo: Partial<ISeason>,
    applyChildren: boolean,
    activeSchool: ISchool
  ) => dispatch(configActions.addSeason(lang, user, seasonInfo, applyChildren, activeSchool)),
  updateSeason: (lang: TLang, user: IUser, seasonInfo: Partial<ISeason>) =>
    dispatch(configActions.updateSeason(lang, user, seasonInfo)),
  resetPhase: () => dispatch(configActions.setPhase(null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAddSeasonProps = PropsFromRedux & {
  handleClose?: () => void;
};

const AddSeason = (props: TAddSeasonProps) => {
  const {
    lang,
    user,
    activeSchool,
    databaseData,
    configPhase,
    pullDatabases,
    addSeason,
    updateSeason,
    resetPhase,
    handleClose
  } = props;
  const { action, subsection } = useParams(); // @note: subsection is season id here
  const { id, type, seasons } = activeSchool;
  const { databases } = databaseData;
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  // If it is edit then get the season info
  const season2Edit =
    action === 'edit' ? seasons?.find((s) => s.id === parseInt(subsection)) : null;

  // Select databases that are not already assigned to another season
  const selectDatabases = databases?.filter(
    (db) => !seasons.filter((s) => s.id != season2Edit?.id).some((s) => s.database === db.name)
  );

  const initialValues: Partial<ISeason> & { applyChildren: boolean } = {
    id: season2Edit?.id || null,
    title: season2Edit?.title || '',
    database: season2Edit?.database || '',
    isActive: season2Edit?.isActive || 'on',
    isDefault: season2Edit?.isDefault || 'off',
    school: `/api/schools/${id}`,
    applyChildren: true
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
    const nonEmptyFields = ['title', 'database'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<ISeason> & { applyChildren: boolean }) => {
    setStatus('submitted');

    if (action === 'new') {
      addSeason(lang, user, values, values.applyChildren, activeSchool);
    } else {
      updateSeason(lang, user, values);
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
    if (!databases) {
      pullDatabases();
    }
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

          {/* Database */}
          <Grid item xs={12}>
            <TextField
              select
              className={`${errors.database ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
              disabled={isSubmitting ? true : false}
              helperText={errors.database ? errors.database : ''}
              error={!!errors.database}
              fullWidth={true}
              id='database'
              label={intl.formatMessage({ id: 'database' })}
              margin='normal'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('database', event.target.value)
              }
              value={values.database}
              variant='outlined'
            >
              {selectDatabases?.map((db) => (
                <MenuItem key={db.id} value={db.name}>
                  {db.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Apply to children */}
          {action === 'new' && type !== 'school' && (
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.applyChildren}
                      color='primary'
                      name='applyChildren'
                      disabled={isSubmitting}
                      value={values.applyChildren}
                      onChange={(event) => setFieldValue('applyChildren', event.target.checked)}
                    />
                  }
                  label={intl.translate({ id: 'season.apply.children' })}
                />
              </FormGroup>
            </Grid>
          )}
        </Grid>

        <FormButtons
          saveButton={<SaveButton disabled={isSubmitting} mode={isSubmitting && 'saving'} />}
        />
      </form>
    </Box>
  );
};

export default connector(AddSeason);
