import React from 'react';
import { useNavigate, useParams } from 'react-router';
import loadable from '@loadable/component';
import {
  TextField,
  Grid,
  Box,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Autocomplete,
  Skeleton
} from '@mui/material';
import { useFormik } from 'formik';

import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import { Place } from 'components/google/MapPlaces';
import { SaveButton } from 'utils/ActionLinks';
import { countryToFlag } from 'utils/Helpers';
import { ICity, ICountry, TLang, IState } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';
import { ISchool } from 'pages/organization/organization-types';

const SchoostDialog = loadable(() => import('components/SchoostDialog'));
const MapPlaces = loadable(() => import('components/google/MapPlaces'));

type TContactProps = {
  user: IUser;
  lang: TLang;
  phase: string;
  schoolInfo: ISchool;
  countries?: ICountry[];
  states?: IState[];
  cities?: ICity[];
  saveSchoolInfo: (
    user: IUser,
    lang: TLang,
    schoolId: number,
    schoolInfo: Partial<ISchool>
  ) => void;
  pullCountries: () => void;
  pullStates: (countryId: string) => void;
  pullCities: (stateId: number) => void;
};

const Contact = (props: TContactProps) => {
  const {
    user,
    lang,
    phase,
    schoolInfo,
    countries,
    states,
    cities,
    saveSchoolInfo,
    pullCountries,
    pullStates,
    pullCities
  } = props;
  const { action } = useParams();
  const navigate = useNavigate();
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const initialValues: Partial<ISchool> & {
    place: Place;
    cityName: string;
    stateShortName: string;
  } = {
    phone1: schoolInfo.phone1,
    phone2: schoolInfo.phone2,
    email: schoolInfo.email,
    fax: schoolInfo.fax,
    zip: schoolInfo.zip,
    countryCode: schoolInfo.countryCode,
    stateId: schoolInfo.stateId,
    stateShortName: null,
    cityId: schoolInfo.cityId,
    cityName: null,
    address: schoolInfo.address,
    googleLink: schoolInfo.googleLink,
    googleMap: schoolInfo.googleMap,
    place: null
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
    const nonEmptyFields = ['email', 'countryCode'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.formatMessage({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const handleDialogOpen = () => {
    setFieldValue('stateShortName', null);
    setFieldValue('cityName', null);
    navigate(`/organization/${schoolInfo.id}/contact/map`);
  };

  const handleDialogClose = () => {
    navigate(`/organization/${schoolInfo.id}/contact`);
  };

  const handleMapPlaceChange = (place: Place) => {
    setFieldValue('place', place);
  };

  const handleMapAddressChange = () => {
    const { address_components, formatted_address } = values.place;

    let address = '';
    let zip = '';
    let countryCode = '';
    let stateShortName = '';
    let cityName = '';

    for (const component of address_components) {
      const componentType = component.types[0];
      switch (componentType) {
        case 'street_number': {
          address = `${component.long_name} ${address}`;
          break;
        }

        case 'route': {
          address += component.short_name;
          break;
        }

        case 'postal_code': {
          zip = `${component.long_name}${zip}`;
          break;
        }

        case 'postal_code_suffix': {
          zip = `${zip}-${component.long_name}`;
          break;
        }

        case 'locality': {
          cityName = component.long_name;
          break;
        }

        case 'administrative_area_level_2': {
          if (cityName === '') {
            cityName = component.long_name;
          }
          break;
        }

        case 'administrative_area_level_1': {
          stateShortName = component.long_name;
          break;
        }

        case 'country': {
          countryCode = component.short_name;
          break;
        }
      }
    }

    setFieldValue('address', address);
    setFieldValue('zip', zip);
    setFieldValue('googleMap', formatted_address);
    if (values.countryCode === countryCode) {
      // If the country didn't change we should have states so we can filter
      const state = states.find(
        (s) => (s.name as string).toLowerCase() === stateShortName.toLowerCase()
      );
      if (state) {
        if (values.stateId === state.id) {
          const city = cities.find((c) => {
            return c.name.toLowerCase() === cityName.toLowerCase();
          });
          if (city) {
            setFieldValue('cityId', city.id);
          }
        } else {
          setFieldValue('stateId', state.id);

          // To find the city add cityName so useEffect will update it
          setFieldValue('cityName', cityName);
        }
      }
    } else {
      // If the country has changed then set names so useEffect will update state and city
      setFieldValue('countryCode', countryCode);
      setFieldValue('stateShortName', stateShortName);
      setFieldValue('cityName', cityName);
    }

    handleDialogClose();
  };

  const submitForm = (values: Partial<ISchool>) => {
    setStatus('submitted');

    saveSchoolInfo(user, lang, schoolInfo.id, values);
  };

  React.useEffect(() => {
    setStatus('notSubmitted');
  }, [setStatus]);

  React.useEffect(() => {
    if (countries?.length === 0) {
      pullCountries();
    }
    pullStates(values?.countryCode || schoolInfo?.countryCode);
    pullCities(values?.stateId || schoolInfo?.stateId);
  }, []);

  React.useEffect(() => {
    pullStates(values.countryCode);
  }, [values.countryCode]);

  React.useEffect(() => {
    if (values.stateShortName) {
      const state = states.find(
        (s) => (s.name as string).toLowerCase() === values.stateShortName.toLowerCase()
      );
      if (state) {
        setFieldValue('stateId', state.id);
      }
    }
  }, [states]);

  React.useEffect(() => {
    pullCities(values.stateId);
  }, [values.stateId]);

  React.useEffect(() => {
    if (values.cityName) {
      const city = cities.find((c) => {
        return c.name.toLowerCase() === values.cityName.toLowerCase();
      });

      if (city) {
        setFieldValue('cityId', city.id);
      }
    }
  }, [cities]);

  React.useEffect(() => {
    if (phase === 'school-updating-success') {
      setSubmitting(false);

      if (status === 'submitted') {
        showSnackbar({
          message: intl.translate({ id: 'app.saved' }),
          open: true
        });
      }
    }
  }, [phase]);

  return (
    <React.Fragment>
      <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
        <Card>
          <CardHeader title={intl.translate({ id: 'school.contact' })} />
          <Divider />
          {/* <TextField fullWidth color='secondary' variant='outlined' inputRef={addressRef} /> */}
          <CardContent>
            {(countries && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    className={`${errors.phone1 ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.phone1 ? errors.phone1 : ''}
                    fullWidth={true}
                    id='phone1'
                    label={intl.translate({ id: 'school.config.phone' })}
                    margin='normal'
                    onChange={handleChange}
                    value={values.phone1}
                    variant='outlined'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    className={`${errors.phone2 ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.phone2 ? errors.phone2 : ''}
                    fullWidth={true}
                    id='phone2'
                    label={`${intl.translate({ id: 'school.config.phone' })}-2`}
                    margin='normal'
                    onChange={handleChange}
                    value={values.phone2}
                    variant='outlined'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    className={`${errors.email ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.email ? errors.email : ''}
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
                  <TextField
                    className={`${errors.fax ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.fax ? errors.fax : ''}
                    fullWidth={true}
                    id='fax'
                    label={intl.translate({ id: 'school.config.email' })}
                    margin='normal'
                    onChange={handleChange}
                    value={values.fax}
                    variant='outlined'
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    className={`${errors.address ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.address ? errors.address : ''}
                    fullWidth={true}
                    id='address'
                    label={intl.translate({ id: 'school.address' })}
                    margin='normal'
                    onChange={handleChange}
                    value={values.address}
                    variant='outlined'
                    onClick={handleDialogOpen}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    className={`${errors.zip ? 'is-invalid' : isSubmitting ? 'is-valid' : ''}`}
                    disabled={isSubmitting ? true : false}
                    helperText={errors.zip ? errors.zip : ''}
                    fullWidth={true}
                    id='zip'
                    label={intl.translate({ id: 'school.config.zipCode' })}
                    margin='normal'
                    onChange={handleChange}
                    value={values.zip}
                    variant='outlined'
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Autocomplete
                    id='countryCode'
                    options={(countries && countries) || []}
                    autoHighlight
                    value={
                      countries &&
                      countries.find((c) => c.isoCode.toString() === values.countryCode.toString())
                    }
                    onChange={(_e, value: ICountry) =>
                      setFieldValue('countryCode', value?.isoCode || '')
                    }
                    getOptionLabel={(option: ICountry) =>
                      `${countryToFlag(option.isoCode)} ${option.country}`
                    }
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
                        value={
                          countries &&
                          countries.find(
                            (c) => c.isoCode.toString() === values.countryCode.toString()
                          )
                        }
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

                <Grid item xs={12} md={4}>
                  <Autocomplete
                    id='stateId'
                    sx={{
                      '& .MuiAutocomplete-option': {
                        fontSize: 15,
                        '& > span': {
                          marginRight: 10,
                          fontSize: 18
                        }
                      }
                    }}
                    options={(states && states.sort((a, b) => (a.name > b.name ? 1 : -1))) || []}
                    autoHighlight
                    value={(states && states.find((s) => s.id === values.stateId)) || null}
                    onChange={(e, value: IState) => setFieldValue('stateId', value?.id || '')}
                    getOptionLabel={(option: IState) => option.name}
                    renderOption={(props, option) => <li {...props}>{option.name}</li>}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={`${
                          errors.stateId ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                        }`}
                        disabled={isSubmitting ? true : false}
                        helperText={errors.stateId ? errors.stateId : ''}
                        value={(states && states.find((s) => s.id === values.stateId)) || null}
                        label={intl.translate({ id: 'app.state' })}
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password' // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Autocomplete
                    id='cityId'
                    sx={{
                      '& .MuiAutocomplete-option': {
                        fontSize: 15,
                        '& > span': {
                          marginRight: 10,
                          fontSize: 18
                        }
                      }
                    }}
                    options={(cities && cities.sort((a, b) => (a.name > b.name ? 1 : -1))) || []}
                    autoHighlight
                    value={(cities && cities.find((c) => c.id === values.cityId)) || null}
                    onChange={(e, value: ICity) => setFieldValue('cityId', value?.id || '')}
                    getOptionLabel={(option: ICity) => option.name}
                    renderOption={(props, option) => <li {...props}>{option.name}</li>}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={`${
                          errors.cityId ? 'is-invalid' : isSubmitting ? 'is-valid' : ''
                        }`}
                        disabled={isSubmitting ? true : false}
                        helperText={errors.cityId ? errors.cityId : ''}
                        value={(cities && cities.find((c) => c.id === values.cityId)) || null}
                        label={intl.translate({ id: 'app.city' })}
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
            )) || (
              <React.Fragment>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Skeleton sx={{ my: 2 }} variant='rectangular' height={55} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton sx={{ my: 2 }} variant='rectangular' height={55} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton sx={{ my: 2 }} variant='rectangular' height={55} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton sx={{ my: 2 }} variant='rectangular' height={55} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton sx={{ my: 2 }} variant='rectangular' height={55} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Skeleton sx={{ my: 2 }} variant='rectangular' height={55} />
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
          </CardContent>

          <Divider />

          <Box sx={{ p: 2 }}>
            <SaveButton mode={isSubmitting ? 'saving' : ''} />
          </Box>
        </Card>
      </form>

      <SchoostDialog
        title={intl.formatMessage({ id: 'school.address' })}
        isOpen={action === 'map'}
        dividers={true}
        handleClose={handleDialogClose}
        handleOk={handleMapAddressChange}
      >
        <MapPlaces address={values.googleMap} handleChange={handleMapPlaceChange} />
      </SchoostDialog>
    </React.Fragment>
  );
};

export default Contact;
