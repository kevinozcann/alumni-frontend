import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { Storage } from 'aws-amplify';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { IAuthUser } from 'pages/auth/data/account-types';
import { authPhaseSelector, authUserSelector } from 'pages/auth/services/store/auth';
import { userActions } from 'pages/profile/services/actions';
import { userPhaseSelector, userProfileSelector } from 'pages/profile/services/store/selectors';

interface IFormValues {
  avatarKey: string;
  avatarObject?: any;
  wallpaperKey: string;
  wallpaperObject?: any;
}

const Images = () => {
  const intl = useTranslation();
  const dispatch = useDispatch();
  const [activeField, setActiveField] = React.useState<string>();
  const { showSnackbar } = useSnackbar();

  const userProfile = useSelector(userProfileSelector);
  const userPhase = useSelector(userPhaseSelector);

  const formInitialValues: IFormValues = {
    avatarKey: userProfile.avatarKey || '',
    avatarObject: null,
    wallpaperKey: userProfile.wallpaperKey || '',
    wallpaperObject: null
  };

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    isSubmitting,
    setSubmitting,
    status,
    setStatus,
    initialValues,
    setFieldValue
  } = useFormik({
    initialValues: formInitialValues,
    validate: (values) => validateForm(values),
    onSubmit: (values) => submitForm(values)
  });

  const validateForm = (values: Partial<IFormValues>) => {
    const errors = {};
    const nonEmptyFields = [];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = React.useCallback(
    async (values: IFormValues) => {
      setStatus('submitted');

      if (activeField === 'avatarKey') {
        try {
          const upload = await Storage.put(values.avatarObject['name'], values.avatarObject);

          dispatch(
            userActions.updateUserProfileImages(userProfile, {
              avatarKey: upload.key
            })
          );
        } catch (error) {
          console.log('Error uploading file: ', error);
        }
      } else if (activeField === 'wallpaperKey') {
        try {
          const upload = await Storage.put(values.wallpaperObject['name'], values.wallpaperObject, {
            level: 'private'
          });

          // dispatch(
          //   authActions.updateUserInfo({
          //     attributes: {
          //       'custom:wallpaperKey': upload.key
          //     }
          //   })
          // );
        } catch (error) {
          console.log('Error uploading file: ', error);
        }
      }
    },
    [activeField, setStatus]
  );

  // Auto save the form
  React.useEffect(() => {
    if (
      values.avatarObject !== initialValues.avatarObject ||
      values.wallpaperObject !== initialValues.wallpaperObject
    ) {
      submitForm(values);
    }
  }, [values, initialValues]);

  React.useEffect(() => {
    if (userPhase === 'success') {
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.translate({ id: 'app.saved' }),
          open: true
        });
      }
    }
  }, [status, userPhase]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader title={intl.translate({ id: 'account.photos' })} />
        <Divider />

        <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth variant='filled'>
                  <InputLabel htmlFor='avatarKey'>
                    {intl.translate({ id: 'logo.photo' })}
                  </InputLabel>
                  <FilledInput
                    id='avatarKey'
                    readOnly
                    value={values.avatarKey}
                    endAdornment={
                      <InputAdornment position='end'>
                        <Button
                          color='primary'
                          disabled={isSubmitting ? true : false}
                          component='label'
                        >
                          <input
                            style={{ display: 'none' }}
                            accept='image/*'
                            id='avatarObject'
                            type='file'
                            onChange={(event) => {
                              setActiveField('avatarKey');
                              setFieldValue(
                                'avatarKey',
                                (event.target as HTMLInputElement).files[0].name
                              );
                              setFieldValue(
                                'avatarObject',
                                (event.target as HTMLInputElement).files[0]
                              );
                            }}
                          />
                          {intl.formatMessage({
                            id: userProfile.avatarKey ? 'app.change' : 'app.add'
                          })}
                        </Button>
                      </InputAdornment>
                    }
                  />
                  {errors.avatarKey && <FormHelperText>{errors.avatarKey}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant='filled'>
                  <InputLabel htmlFor='wallpaperKey'>
                    {intl.translate({ id: 'user.wallpaper' })}
                  </InputLabel>
                  <FilledInput
                    id='wallpaperKey'
                    readOnly
                    value={values.wallpaperKey}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position='end'>
                        <Button
                          color='primary'
                          disabled={isSubmitting ? true : false}
                          component='label'
                        >
                          <input
                            style={{ display: 'none' }}
                            accept='image/*'
                            id='wallpaperObject'
                            type='file'
                            onChange={(event) => {
                              setActiveField('wallpaperKey');
                              setFieldValue(
                                'wallpaperKey',
                                (event.target as HTMLInputElement).files[0].name
                              );
                              setFieldValue(
                                'wallpaperObject',
                                (event.target as HTMLInputElement).files[0]
                              );
                            }}
                          />
                          {intl.formatMessage({
                            id: userProfile.wallpaperKey ? 'app.change' : 'app.add'
                          })}
                        </Button>
                      </InputAdornment>
                    }
                  />
                  {errors.wallpaperKey && <FormHelperText>{errors.wallpaperKey}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Images;
