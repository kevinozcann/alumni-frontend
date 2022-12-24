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
import { Amplify, Storage } from 'aws-amplify';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { IUser } from 'pages/auth/data/account-types';
import { authPhaseSelector, authUserSelector } from 'pages/auth/services/store/auth';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

interface IFormValues {
  picture: string;
  pictureObject?: any;
  wallpaper: string;
  wallpaperObject?: any;
}

const Images = () => {
  const intl = useTranslation();
  const dispatch = useDispatch();
  const [activeField, setActiveField] = React.useState<string>();
  const { showSnackbar } = useSnackbar();

  const user = useSelector(authUserSelector);
  const authPhase = useSelector(authPhaseSelector);

  const userAttributes: IUser = user.attributes;

  const formInitialValues: IFormValues = {
    picture: userAttributes['custom:picture'],
    pictureObject: null,
    wallpaper: userAttributes['custom:wallpaper'],
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
    const nonEmptyFields = ['picture', 'wallpaper'];

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

      if (activeField === 'picture') {
        try {
          const upload = await Storage.put(values.pictureObject['name'], values.pictureObject, {
            level: 'private'
          });

          // dispatch(
          //   authActions.updateUserInfo({
          //     attributes: {
          //       'custom:picture': upload.key
          //     }
          //   })
          // );
        } catch (error) {
          console.log('Error uploading file: ', error);
        }
      } else if (activeField === 'wallpaper') {
        try {
          const upload = await Storage.put(values.wallpaperObject['name'], values.wallpaperObject, {
            level: 'private'
          });

          // dispatch(
          //   authActions.updateUserInfo({
          //     attributes: {
          //       'custom:wallpaper': upload.key
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
      values.pictureObject !== initialValues.pictureObject ||
      values.wallpaperObject !== initialValues.wallpaperObject
    ) {
      submitForm(values);
    }
  }, [values, initialValues]);

  React.useEffect(() => {
    if (authPhase === 'success') {
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.translate({ id: 'app.saved' }),
          open: true
        });
      }
    }
  }, [status, authPhase]);

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
                  <InputLabel htmlFor='picture'>{intl.translate({ id: 'logo.photo' })}</InputLabel>
                  <FilledInput
                    id='picture'
                    readOnly
                    value={values.picture}
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
                            id='pictureObject'
                            type='file'
                            onChange={(event) => {
                              setActiveField('picture');
                              setFieldValue(
                                'picture',
                                (event.target as HTMLInputElement).files[0].name
                              );
                              setFieldValue(
                                'pictureObject',
                                (event.target as HTMLInputElement).files[0]
                              );
                            }}
                          />
                          {intl.formatMessage({
                            id: userAttributes['custom:picture'] ? 'app.change' : 'app.add'
                          })}
                        </Button>
                      </InputAdornment>
                    }
                  />
                  {errors.picture && <FormHelperText>{errors.picture}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant='filled'>
                  <InputLabel htmlFor='wallpaper'>
                    {intl.translate({ id: 'user.wallpaper' })}
                  </InputLabel>
                  <FilledInput
                    id='wallpaper'
                    readOnly
                    value={values.wallpaper}
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
                              setActiveField('wallpaper');
                              setFieldValue(
                                'wallpaper',
                                (event.target as HTMLInputElement).files[0].name
                              );
                              setFieldValue(
                                'wallpaperObject',
                                (event.target as HTMLInputElement).files[0]
                              );
                            }}
                          />
                          {intl.formatMessage({
                            id: userAttributes['custom:wallpaper'] ? 'app.change' : 'app.add'
                          })}
                        </Button>
                      </InputAdornment>
                    }
                  />
                  {errors.wallpaper && <FormHelperText>{errors.wallpaper}</FormHelperText>}
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
