import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormik } from 'formik';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  CardHeader,
  Divider,
  Autocomplete,
  Box,
  Typography,
  CardActions,
  Switch,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner, faTrash } from '@fortawesome/pro-duotone-svg-icons';

import { timezones } from 'data';
import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';
import Filter, { IFilter, IFilterOptions } from 'components/filter/Filter';
import { TLang } from 'utils/shared-types';
import StyledMenu from 'utils/StyledMenu';
import { IUser } from 'pages/account/account-types';

import { ISchool, TConfiguration } from '../organization-types';
import { schoolActions, schoolFiltersSelector } from '../_store/school';

const hiddenFields = [
  'address',
  'bigLogo', // used as dark logo
  'cityId',
  'countryId',
  'favicon',
  'logo',
  'normalLogo',
  'phone',
  'picture',
  'showBgColorOnMobile',
  'showBgColorSetting',
  'sitename',
  'smallLogo', // used as light log
  'stateId',
  'zipCode'
];
const adminFields = [
  'checkServerName',
  'embed_form_url',
  'fileServerUrl',
  'institutionType',
  'loginScreenBgColor',
  'parentSelfRegistration',
  'realIpHeader',
  'showBranches',
  'startDate',
  'studentSelfRegistration',
  'supportEmail',
  'url',
  'useAutomation'
];
// const addableFields = ['IBCode', 'CEEBCode', 'googleLink', 'googleMap'];

type TFormValues = Record<string, any>;

const mapStateToProps = (state: RootState) => ({
  filters: schoolFiltersSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setFilters: (filters: IFilter[]) => dispatch(schoolActions.setFilters(filters))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TConfigProps = PropsFromRedux & {
  user: IUser;
  lang: TLang;
  phase: string;
  schoolInfo: ISchool;
  resetPhase: () => void;
  updateConfig: (configInfo: TConfiguration, idToDelete?: number) => void;
};

const Config = (props: TConfigProps) => {
  const { user, phase, schoolInfo, filters, setFilters, resetPhase, updateConfig } = props;
  const [selectedId, setSelectedId] = React.useState<number>();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { superAdmin } = user;

  const filterOptions: IFilterOptions[] = [];
  //   {
  //     label: 'Type',
  //     filters: [
  //       { id: 'type:1', title: 'Freelance' },
  //       { id: 'type:2', title: 'Fulltime' }
  //     ]
  //   },
  //   {
  //     label: 'Level',
  //     filters: [
  //       { id: 'level:1', title: 'Beginner' },
  //       { id: 'level:2', title: 'Intermediate' }
  //     ]
  //   }
  // ];
  const filterChecks: IFilterOptions[] = [
    {
      label: intl.translate({ id: 'school.config.admin_only' }),
      filters: [{ id: 'is:AdminOnly', title: intl.translate({ id: 'school.config.admin_only' }) }]
    }
  ];

  // Filter to get rid of hidden fields
  let configuration = schoolInfo.configuration.filter((c) => !hiddenFields.includes(c.configKey));
  // Apply user filters
  filters?.forEach((f) => {
    if (f.id === 'is:AdminOnly') {
      configuration = configuration.filter((c) => adminFields.includes(c.configKey));
    }
    if (f.id.includes('search')) {
      configuration = configuration.filter(
        (c) => c.configKey.includes(f.title) || c.configValue.includes(f.title)
      );
    }
  });
  // Sort configurations
  configuration.sort((a, b) => (a.configKey < b.configKey ? 1 : -1));
  configuration.sort((a) => (adminFields.includes(a.configKey) ? 1 : -1));
  configuration.sort((a) => (['slogan'].includes(a.configKey) ? -1 : 1));
  // configuration.sort((a) => (['sitename'].includes(a.configKey) ? -1 : 1));

  const initialFormValues: TFormValues = {};
  configuration?.forEach((c) => {
    initialFormValues[c.configKey] = c.configValue;
  });

  const { handleSubmit, handleChange, setFieldValue, values, isSubmitting, setSubmitting } =
    useFormik({
      initialValues: initialFormValues || {},
      onSubmit: (values) => submitForm(values)
    });

  const handleSaveClick = React.useCallback((cnf: TConfiguration) => {
    setSelectedId(cnf.id);
  }, []);

  const handleDeleteClick = React.useCallback((cnf: TConfiguration) => {
    setSelectedId(cnf.id);
    const configToDelete = configuration?.find((v) => v.id === cnf.id);
    // Delete the config
    updateConfig(null, configToDelete.id);
  }, []);

  const handleSelectChange = React.useCallback(
    (event: SelectChangeEvent<string>, cnf: TConfiguration) => {
      setSelectedId(cnf.id);
      setFieldValue(cnf.configKey, event.target.value);
    },
    []
  );

  const handleSwitchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, cnf: TConfiguration) => {
      setSelectedId(cnf.id);
      setFieldValue(cnf.configKey, event.target.checked ? '1' : '0');
    },
    []
  );

  const submitForm = (values: TFormValues) => {
    if (selectedId && values != initialFormValues) {
      const configToUpdate = configuration?.find((v) => v.id === selectedId);
      const configInfo = Object.assign({}, configToUpdate, {
        configValue: values[configToUpdate['configKey']]
      });

      // Update the config
      updateConfig(configInfo);
    }
  };

  const handleActionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (phase === 'success' && isSubmitting) {
      showSnackbar({
        message: intl.translate({ id: 'app.saved' }),
        open: true
      });
      setSubmitting(false);
      resetPhase();
    }
  }, [phase, isSubmitting]);

  React.useEffect(() => {
    resetPhase();
  }, []);

  return (
    <React.Fragment>
      <Filter
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        filterChecks={filterChecks}
      />

      <Box sx={{ m: 3 }} />

      <form className='form' noValidate={true} autoComplete='off' onSubmit={handleSubmit}>
        <Card>
          <CardHeader title={intl.translate({ id: 'school.config' })} />

          {/* <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='newConfigKey'
                  label={intl.translate({ id: 'school.principal' })}
                  margin='normal'
                  onChange={handleChange}
                  value={values.principal}
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='newConfigValue'
                  label={intl.translate({ id: 'school.principal' })}
                  margin='normal'
                  onChange={handleChange}
                  value={values.principal}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </CardContent> */}

          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              {configuration?.map((cnf: TConfiguration) => {
                const isAdminOnly = adminFields.includes(cnf.configKey);

                return (
                  <Grid key={cnf.id} item xs={12} md={6}>
                    <Card
                      raised
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CardHeader
                        title={intl.formatMessage({ id: `school.config.${cnf.configKey}` })}
                        subheader={
                          !isAdminOnly &&
                          intl.formatMessage({
                            id: `school.config.${cnf.configKey}.description`
                          })
                        }
                        action={
                          <>
                            <IconButton
                              aria-label='save'
                              type='submit'
                              title={intl.translate({ id: 'app.save' })}
                              onClick={() => handleSaveClick(cnf)}
                            >
                              <FontAwesomeIcon
                                spin={isSubmitting && selectedId === cnf.id}
                                icon={
                                  (isSubmitting && selectedId === cnf.id && faSpinner) || faSave
                                }
                              />
                            </IconButton>

                            {superAdmin && (
                              <>
                                <IconButton
                                  aria-label='config-actions'
                                  aria-haspopup='true'
                                  onClick={handleActionsClick}
                                  size='large'
                                >
                                  <MoreVert />
                                </IconButton>

                                <StyledMenu
                                  id='actions-menu'
                                  keepMounted
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={handleActionsClose}
                                >
                                  <MenuItem onClick={() => handleDeleteClick(cnf)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                    {intl.translate({ id: 'app.delete' })}
                                  </MenuItem>
                                </StyledMenu>
                              </>
                            )}
                          </>
                        }
                      />

                      <Divider />

                      <CardContent sx={{ pb: 1 }}>
                        {(cnf.configKey === 'timezone' && (
                          <Autocomplete
                            id={cnf.configKey}
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
                            value={values[cnf.configKey]}
                            onChange={(e, value) => setFieldValue('timezone', value || '')}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                disabled={isSubmitting && selectedId === cnf.id}
                                value={values.timezone}
                                variant='outlined'
                                margin='normal'
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password' // disable autocomplete and autofill
                                }}
                              />
                            )}
                          />
                        )) ||
                          ([
                            'saveUserLogs',
                            'showBranches',
                            'parentSelfRegistration',
                            'studentSelfRegistration',
                            'showBgColorOnMobile',
                            'showBgColorSetting'
                          ].includes(cnf.configKey) && (
                            <Switch
                              sx={{ mt: 1 }}
                              id={cnf.configKey}
                              checked={values[cnf.configKey] === '1'}
                              value={values[cnf.configKey]}
                              onChange={(event) => handleSwitchChange(event, cnf)}
                              size='medium'
                              inputProps={{ 'aria-label': cnf.configKey }}
                            />
                          )) ||
                          (cnf.configKey === 'language' && (
                            <Select
                              sx={{ mt: 1 }}
                              fullWidth
                              id={cnf.configKey}
                              value={values[cnf.configKey]}
                              variant='outlined'
                              onChange={(event) => handleSelectChange(event, cnf)}
                            >
                              <MenuItem value='tr'>Türkçe</MenuItem>
                              <MenuItem value='en'>English</MenuItem>
                            </Select>
                          )) || (
                            <TextField
                              disabled={
                                (!superAdmin && isAdminOnly) ||
                                (isSubmitting && selectedId === cnf.id)
                              }
                              fullWidth
                              id={cnf.configKey}
                              margin='normal'
                              onChange={handleChange}
                              value={values[cnf.configKey]}
                              variant='outlined'
                            />
                          )}
                      </CardContent>

                      {superAdmin && (
                        <CardActions sx={{ mx: 2, display: 'flex' }}>
                          <Typography gutterBottom variant='body2'>
                            {cnf.configKey}
                          </Typography>
                          <Box sx={{ flexGrow: 1 }} />
                          {isAdminOnly && (
                            <Typography
                              gutterBottom
                              variant='overline'
                              sx={{ color: 'secondary.main' }}
                            >
                              {intl.translate({ id: 'school.config.admin_only' })}
                            </Typography>
                          )}
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </form>
    </React.Fragment>
  );
};

export default connector(Config);
