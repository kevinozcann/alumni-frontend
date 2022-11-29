import { Amplify, Storage } from 'aws-amplify';
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
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useFileManager from 'hooks/useFileManager';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { IUserAttributes } from 'pages/account/account-types';
import { authActions, authPhaseSelector, authUserSelector } from 'store/auth';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

interface IFormValues {
  picture: string;
  wallpaper: string;
}

const Images = () => {
  const intl = useTranslation();
  const dispatch = useDispatch();
  const { showFileManager } = useFileManager();
  const { showSnackbar } = useSnackbar();

  const user = useSelector(authUserSelector);
  const phase = useSelector(authPhaseSelector);

  const userAttributes: IUserAttributes = user.attributes;

  const formInitialValues: IFormValues = {
    picture: userAttributes['custom:picture'],
    wallpaper: userAttributes['custom:wallpaper']
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
      try {
        const upload = await Storage.put(values.picture['name'], values.picture, {
          level: 'private'
        });

        dispatch(
          authActions.updateUserInfo({
            attributes: {
              'custom:picture': upload.key
            }
          })
        );
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    },
    [setStatus]
  );

  const handleSelectCallback = (fieldId: string, fieldValue: any) => {
    setFieldValue(fieldId, fieldValue);
    setStatus('notSubmitted');
  };

  // Auto save the form
  React.useEffect(() => {
    if (values !== initialValues) {
      submitForm(values);
    }
  }, [values, initialValues, submitForm]);

  React.useEffect(() => {
    if (phase === 'success') {
      console.log(phase);
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.translate({ id: 'app.saved' }),
          open: true
        });
      }
    }
  }, [status, phase]);

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
                    type='file'
                    readOnly
                    onChange={(event) => {
                      setFieldValue('picture', (event.target as HTMLInputElement).files[0]);
                    }}
                    endAdornment={
                      <InputAdornment position='end'>
                        <Button
                          color='primary'
                          disabled={isSubmitting ? true : false}
                          // onClick={() =>
                          //   showFileManager({
                          //     iframeSrc: pictureFMLink,
                          //     isOpen: true,
                          //     selectCallback: handleSelectCallback
                          //   })
                          // }
                        >
                          {intl.formatMessage({ id: user.picture ? 'app.change' : 'app.add' })}
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
                          // onClick={() =>
                          //   showFileManager({
                          //     iframeSrc: wallpaperFMLink,
                          //     isOpen: true,
                          //     selectCallback: handleSelectCallback
                          //   })
                          // }
                        >
                          {intl.formatMessage({ id: user.wallpaper ? 'app.change' : 'app.add' })}
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
