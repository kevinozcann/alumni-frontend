import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useFormik } from 'formik';
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

import { updateApiUrl, FILEMANAGER_USER_URL } from 'store/ApiUrls';
import useTranslation from 'hooks/useTranslation';
import useSnackbar from 'hooks/useSnackbar';
import useFileManager from 'hooks/useFileManager';
import { TLang } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

interface IImagesProps {
  lang: TLang;
  user: IUser;
  phase: string;
  updateUserInfo: (userId: string, user: Partial<IUser>) => void;
}
interface IFormValues {
  picture: string;
  wallpaper: string;
}

const Images: React.FC<IImagesProps> = ({ lang, user, phase, updateUserInfo }) => {
  const intl = useTranslation();
  const { showFileManager } = useFileManager();
  const { showSnackbar } = useSnackbar();

  const formInitialValues: IFormValues = {
    picture: user.picture,
    wallpaper: user.wallpaper
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
  const { data: pictureFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_USER_URL, { lang: lang, userId: user.uuid }) + '/picture',
    fetcher
  );
  const { data: wallpaperFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_USER_URL, { lang: lang, userId: user.uuid }) + '/wallpaper',
    fetcher
  );

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
    (values) => {
      setStatus('submitted');
      updateUserInfo(user.uuid, values);
    },
    [user.uuid, setStatus, updateUserInfo]
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
    console.log(phase);
    if (phase === 'userinfo-pull-successful') {
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
                    readOnly
                    value={values.picture}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position='end'>
                        <Button
                          color='primary'
                          disabled={isSubmitting ? true : false}
                          onClick={() =>
                            showFileManager({
                              iframeSrc: pictureFMLink,
                              isOpen: true,
                              selectCallback: handleSelectCallback
                            })
                          }
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
                          onClick={() =>
                            showFileManager({
                              iframeSrc: wallpaperFMLink,
                              isOpen: true,
                              selectCallback: handleSelectCallback
                            })
                          }
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
