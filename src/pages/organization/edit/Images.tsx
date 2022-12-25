import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useFormik } from 'formik';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  TextField,
  Grid,
  CardHeader,
  Divider,
  Box
} from '@mui/material';

import { defaultLogo } from 'config';
import { updateApiUrl, FILEMANAGER_SCHOOL_URL } from 'store/ApiUrls';
import useFileManager from 'hooks/useFileManager';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { EditButton } from 'utils/ActionLinks';
import { TLang } from 'utils/shared-types';
import { IAuthUser } from 'pages/auth/data/account-types';
import { ISchool, TConfigKey, TConfiguration } from 'pages/organization/organization-types';

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};
const imageFields = ['favicon', 'picture', 'smallLogo', 'normalLogo', 'bigLogo'];

type TLogo = {
  id: string;
  title: string;
  description: string;
  size?: {
    width?: number;
    height?: number;
  };
};
type TImagesProps = {
  user: IAuthUser;
  lang: TLang;
  phase: string;
  schoolInfo: ISchool;
  updateConfig?: (configInfo: TConfiguration, idToDelete?: number) => void;
  saveSchoolInfo?: (
    user: IAuthUser,
    lang: TLang,
    schoolId: number,
    schoolInfo: Partial<ISchool>
  ) => void;
};

const Images = (props: TImagesProps) => {
  const { user, lang, phase, schoolInfo, updateConfig, saveSchoolInfo } = props;
  const [selectedKey, setSelectedKey] = React.useState<string>();
  const intl = useTranslation();
  const { showFileManager } = useFileManager();
  const { showSnackbar } = useSnackbar();

  const configuration: {
    favicon?: string;
    picture?: string;
    smallLogo?: string;
    normalLogo?: string;
    bigLogo?: string;
  } = {};
  schoolInfo.configuration?.forEach((c) => {
    if (imageFields.includes(c.configKey)) {
      configuration[c.configKey] = c.configValue;
    }
  });

  const { data: pictureFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_SCHOOL_URL, { lang, schoolId: schoolInfo.id }) + '/logo/picture',
    fetcher,
    { refreshInterval: 0 }
  );
  const { data: faviconFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_SCHOOL_URL, { lang, schoolId: schoolInfo.id }) + '/logo/favicon',
    fetcher,
    { refreshInterval: 0 }
  );
  const { data: smallLogoFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_SCHOOL_URL, { lang, schoolId: schoolInfo.id }) + '/logo/smallLogo',
    fetcher,
    { refreshInterval: 0 }
  );
  const { data: normalLogoFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_SCHOOL_URL, { lang, schoolId: schoolInfo.id }) + '/logo/normalLogo',
    fetcher,
    { refreshInterval: 0 }
  );
  const { data: bigLogoFMLink } = useSWR(
    updateApiUrl(FILEMANAGER_SCHOOL_URL, { lang, schoolId: schoolInfo.id }) + '/logo/bigLogo',
    fetcher,
    { refreshInterval: 0 }
  );

  const logos: TLogo[] = [
    {
      id: 'normalLogo',
      title: intl.translate({ id: 'logo.normal' }),
      description: intl.translate({ id: 'logo.normal.description' }),
      size: { height: 40, width: 192 }
    },
    {
      id: 'smallLogo',
      title: intl.translate({ id: 'logo.light' }),
      description: intl.translate({ id: 'logo.light.description' }),
      size: { height: 40, width: 192 }
    },
    {
      id: 'bigLogo',
      title: intl.translate({ id: 'logo.dark' }),
      description: intl.translate({ id: 'logo.dark.description' }),
      size: { height: 40, width: 192 }
    },
    {
      id: 'favicon',
      title: intl.translate({ id: 'logo.favicon' }),
      description: intl.translate({ id: 'logo.favicon.description' }),
      size: { height: 48, width: 48 }
    },
    {
      id: 'picture',
      title: intl.translate({ id: 'logo.photo' }),
      description: intl.translate({ id: 'logo.photo.description' }),
      size: { height: 40, width: 192 }
    }
  ];

  const initialFormValues: Partial<ISchool> = {
    favicon: configuration?.favicon || schoolInfo.favicon || defaultLogo,
    picture: configuration?.picture || schoolInfo.picture || defaultLogo,
    smallLogo: configuration?.smallLogo || schoolInfo.smallLogo || defaultLogo,
    normalLogo: configuration?.normalLogo || schoolInfo.normalLogo || defaultLogo,
    bigLogo: configuration?.bigLogo || schoolInfo.bigLogo || defaultLogo
  };

  const { handleSubmit, handleChange, setFieldValue, values, status, setStatus, initialValues } =
    useFormik({
      initialValues: initialFormValues,
      validate: (values) => validateForm(values),
      onSubmit: (values) => submitForm(values)
    });

  const validateForm = (values: Partial<ISchool>) => {
    const errors = {};
    const nonEmptyFields = ['email', 'timezone', 'countryCode'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.translate({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const submitForm = (values: Partial<ISchool>) => {
    setStatus('submitted');

    const configToUpdate = schoolInfo.configuration?.find((v) => v.configKey === selectedKey);
    const configInfo = configToUpdate
      ? Object.assign({}, configToUpdate, {
          configValue: values[configToUpdate['configKey']]
        })
      : {
          id: null,
          configKey: selectedKey as TConfigKey,
          configValue: values[selectedKey],
          school: `/api/schools/${schoolInfo.id}`
        };

    // Update the config
    updateConfig(configInfo);

    // update school info
    saveSchoolInfo(user, lang, schoolInfo.id, values);
  };

  const fileManagerLink = (id: string) =>
    id === 'bigLogo'
      ? bigLogoFMLink
      : id === 'normalLogo'
      ? normalLogoFMLink
      : id === 'smallLogo'
      ? smallLogoFMLink
      : id === 'picture'
      ? pictureFMLink
      : faviconFMLink;

  const handleSelectCallback = (fieldId: string, fieldValue: any) => {
    setSelectedKey(fieldId);
    setFieldValue(fieldId, fieldValue);

    setStatus('notSubmitted');
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  // Auto save the form
  React.useEffect(() => {
    if (values !== initialValues) {
      submitForm(values);
    }
  }, [values, initialValues]);

  React.useEffect(() => {
    if (phase === 'school-updating-success') {
      if (status === 'submitted') {
        showSnackbar({
          message: intl.translate({ id: 'app.saved' }),
          open: true
        });
      }
    }
  }, [phase]);

  return (
    <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
      <Card>
        <CardHeader title={intl.translate({ id: 'school.images' })} />
        <Divider />

        <CardContent>
          <Grid container spacing={3}>
            {logos.map((logo) => (
              <Grid key={logo.id} item xs={12} md={4}>
                <Card
                  variant='outlined'
                  sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent>
                    <CardMedia
                      sx={{
                        maxHeight: 120,
                        margin: '0 auto',
                        width: logo.size.width,
                        height: logo.size.height
                      }}
                      component='img'
                      image={values[logo.id]}
                      title={logo.description}
                      onError={() => setFieldValue(logo.id, defaultLogo)}
                    />
                  </CardContent>
                  <CardContent>
                    <Typography gutterBottom variant='h5'>
                      {logo.title}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {logo.description}
                    </Typography>
                  </CardContent>

                  <Box sx={{ flexGrow: 1 }} />

                  <CardActions>
                    <TextField
                      sx={{ display: 'none' }}
                      id={logo.id}
                      onChange={handleChange}
                      value={values[logo.id]}
                    />
                    <EditButton
                      title={intl.translate({ id: 'app.edit' })}
                      variant='outlined'
                      onClick={() =>
                        showFileManager({
                          iframeSrc: fileManagerLink(logo.id),
                          isOpen: true,
                          selectCallback: handleSelectCallback
                        })
                      }
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default Images;
