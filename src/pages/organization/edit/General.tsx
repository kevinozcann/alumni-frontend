import React from 'react';
import { useIntl } from 'react-intl';
import {
  TextField,
  Switch,
  Grid,
  FormControlLabel,
  Card,
  CardHeader,
  Divider,
  CardContent,
  CardActions
} from '@mui/material';
import { useFormik } from 'formik';

import useSnackbar from 'hooks/useSnackbar';
import { SaveButton } from 'utils/ActionLinks';
import { TLang } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';

import { ISchool, TConfigKey, TConfiguration } from '../organization-types';

type TGeneralProps = {
  user: IUser;
  lang: TLang;
  phase: string;
  schoolInfo: ISchool;
  updateConfig?: (configInfo: TConfiguration, idToDelete?: number) => void;
  saveSchoolInfo?: (
    user: IUser,
    lang: TLang,
    schoolId: number,
    schoolInfo: Partial<ISchool>
  ) => void;
};

const General = (props: TGeneralProps) => {
  const { user, lang, phase, schoolInfo, updateConfig, saveSchoolInfo } = props;
  const intl = useIntl();
  const { showSnackbar } = useSnackbar();

  const initialValues: Partial<ISchool> = {
    title: schoolInfo?.title || '',
    menuTitle: schoolInfo?.menuTitle || '',
    founder: schoolInfo?.founder || '',
    representative: schoolInfo?.representative || '',
    principal: schoolInfo?.principal || '',
    ibCode: schoolInfo?.ibCode || '',
    ceebCode: schoolInfo?.ceebCode || '',
    isActive: schoolInfo?.isActive || false
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

  const validateForm = (values: Partial<ISchool>) => {
    const errors = {};
    const nonEmptyFields = ['title', 'menuTitle'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.formatMessage({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<ISchool>) => {
    setStatus('submitted');

    // Update sitename config
    const sitenameConfigKey = 'sitename';
    const configToUpdate = schoolInfo.configuration?.find((v) => v.configKey === sitenameConfigKey);
    const configInfo = configToUpdate
      ? Object.assign({}, configToUpdate, {
          configValue: values.menuTitle
        })
      : {
          id: null,
          configKey: sitenameConfigKey as TConfigKey,
          configValue: values.menuTitle,
          school: `/api/schools/${schoolInfo.id}`
        };

    // Update the config
    updateConfig(configInfo);

    saveSchoolInfo(user, lang, schoolInfo.id, values);
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  React.useEffect(() => {
    if (phase === 'school-updating-success') {
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.formatMessage({ id: 'app.saved' }),
          open: true
        });
      }
    }
  }, [phase]);

  return (
    <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
      <Card>
        <CardHeader title={intl.formatMessage({ id: 'school.general' })} />
        <Divider />
        <CardContent sx={{ mt: 1 }}>
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
                className={`${errors.menuTitle ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                disabled={isSubmitting ? true : false}
                helperText={errors.menuTitle ? errors.menuTitle : ''}
                error={!!errors.menuTitle}
                fullWidth={true}
                id='menuTitle'
                label={intl.formatMessage({ id: 'school.menu_name' })}
                margin='normal'
                onChange={handleChange}
                value={values.menuTitle}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                className={`${errors.founder ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                disabled={isSubmitting ? true : false}
                helperText={errors.founder ? errors.founder : ''}
                fullWidth={true}
                id='founder'
                label={intl.formatMessage({ id: 'school.founder' })}
                margin='normal'
                onChange={handleChange}
                value={values.founder}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                className={`${
                  errors.representative ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                }`}
                disabled={isSubmitting ? true : false}
                helperText={errors.representative ? errors.representative : ''}
                fullWidth={true}
                id='representative'
                label={intl.formatMessage({ id: 'school.founder_rep' })}
                margin='normal'
                onChange={handleChange}
                value={values.representative}
                variant='outlined'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                className={`${errors.principal ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                disabled={isSubmitting ? true : false}
                helperText={errors.principal ? errors.principal : ''}
                fullWidth={true}
                id='principal'
                label={intl.formatMessage({ id: 'school.principal' })}
                margin='normal'
                onChange={handleChange}
                value={values.principal}
                variant='outlined'
              />
            </Grid>

            <Grid sx={{ p: '0 !important' }} item xs={12} md={6}></Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.isActive}
                    color='primary'
                    disabled={isSubmitting ? true : false}
                    id='isActive'
                    onChange={(event) => setFieldValue('isActive', event.target.checked)}
                  />
                }
                label={intl.formatMessage({ id: 'app.is_active' })}
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2 }}>
          <SaveButton mode={isSubmitting ? 'saving' : ''} />
        </CardActions>
      </Card>
    </form>
  );
};

export default General;
