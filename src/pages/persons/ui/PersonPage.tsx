import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  useTheme,
  Grid,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  TextField,
  MenuItem
} from '@mui/material';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useTranslation from 'hooks/useTranslation';
import Page from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';
import { personsSelector, IPerson } from '../services/persons';
import { IBreadcrumb } from 'components/BreadCrumbs';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const PersonPage = () => {
  const navigate = useNavigate();
  const subheader = useSubheader();
  const intl = useTranslation();
  const theme = useTheme();
  const { id, action } = useParams();
  const transStudents = intl.translate({ id: 'school.students' });

  const [section, setSection] = React.useState<string>('general');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSection(newValue);
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank');
  };

  const persons = useSelector(personsSelector);
  const personInfo: IPerson = persons.find((g: IPerson) => g.id === id);
  const personName = personInfo?.name + ' ' + personInfo?.second_name + ' ' + personInfo?.last_name;

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transStudents, url: '/persons', original: true });
    breadcrumbs.push({ title: personName, url: `/persons/person-page/${id}`, original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={transStudents}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs>
            <Card>
              <CardHeader
                avatar={<Avatar alt='username' src={personInfo?.student_picture} />}
                title={personName}
                subheader={personInfo?.email}
                action={
                  <React.Fragment>
                    <Box sx={{ mt: 1, display: { xs: 'none', md: 'block' } }}>
                      <React.Fragment>
                        <IconButton
                          disabled={personInfo.linkedin_url == '' ? true : false}
                          component='button'
                          style={{ marginRight: 5 }}
                          onClick={() => openInNewTab(personInfo.linkedin_url)}
                          size='large'
                        >
                          <FontAwesomeIcon icon={faLinkedin} size='xs' />
                        </IconButton>
                        <IconButton
                          disabled={personInfo.twitter_url == '' ? true : false}
                          component='button'
                          style={{ marginRight: 5 }}
                          onClick={() => openInNewTab(personInfo.twitter_url)}
                          size='large'
                        >
                          <FontAwesomeIcon icon={faTwitter} size='xs' />
                        </IconButton>
                        <IconButton
                          disabled={personInfo.facebook_url == '' ? true : false}
                          component='button'
                          style={{ marginRight: 5 }}
                          onClick={() => openInNewTab(personInfo.facebook_url)}
                          size='large'
                        >
                          <FontAwesomeIcon icon={faFacebook} size='xs' />
                        </IconButton>
                      </React.Fragment>
                    </Box>
                  </React.Fragment>
                }
              />
            </Card>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={section} onChange={handleChange} aria-label='basic tabs example'>
                <Tab label={intl.formatMessage({ id: 'school.general' })} value='general' />
                <Tab label={intl.formatMessage({ id: 'school.info' })} value='schoolInfo' />
                <Tab
                  label={intl.formatMessage({ id: 'communication.info' })}
                  value='communicationInfo'
                />
              </Tabs>
            </Box>

            <Box sx={{ mt: 3 }}>
              {(section === 'general' && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'person.name' })}
                      value={personInfo?.name}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'person.secondname' })}
                      value={personInfo?.second_name}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'person.lastname' })}
                      value={personInfo?.last_name}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'id_number' })}
                      value={personInfo?.ssn_number}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'date_of_birth' })}
                      value={
                        personInfo?.birth_date != null
                          ? format(new Date(personInfo?.birth_date), 'P')
                          : ''
                      }
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select={true}
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'gender' })}
                      value={personInfo?.gender}
                      variant='outlined'
                    >
                      <MenuItem key='1' value='MALE' dense={true}>
                        {`${intl.translate({ id: 'person.male' })}`}
                      </MenuItem>
                      <MenuItem key='2' value='FEMAIL' dense={true}>
                        {`${intl.translate({ id: 'person.female' })}`}
                      </MenuItem>
                      <MenuItem key='3' value='OTHER' dense={true}>
                        {`${intl.translate({ id: 'other' })}`}
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'person.occupation' })}
                      value={personInfo?.occupation}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select={true}
                      disabled
                      fullWidth={true}
                      label={intl.translate({ id: 'person.marital_status' })}
                      value={personInfo?.marital_status}
                      variant='outlined'
                    >
                      <MenuItem key='1' value='SINGLE' dense={true}>
                        {`${intl.translate({ id: 'person.single' })}`}
                      </MenuItem>
                      <MenuItem key='2' value='MARRIED' dense={true}>
                        {`${intl.translate({ id: 'person.married' })}`}
                      </MenuItem>
                      <MenuItem key='3' value='SEPARATED' dense={true}>
                        {`${intl.translate({ id: 'person.separated' })}`}
                      </MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              )) ||
                (section === 'schoolInfo' && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        fullWidth={true}
                        label={intl.translate({ id: 'student.no' })}
                        value={personInfo?.school_number}
                        variant='outlined'
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        fullWidth={true}
                        label={intl.translate({ id: 'person.graduation_period' })}
                        value={personInfo?.graduation_period}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        fullWidth={true}
                        label={intl.translate({ id: 'person.graduation_status' })}
                        value={personInfo?.graduation_status}
                        variant='outlined'
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        fullWidth={true}
                        label={intl.translate({ id: 'person.education_status' })}
                        value={personInfo?.education_status}
                        variant='outlined'
                      />
                    </Grid>
                  </Grid>
                )) ||
                (section === 'communicationInfo' && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        fullWidth={true}
                        label={intl.translate({ id: 'user.phone_number' })}
                        value={personInfo?.phone_number}
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        disabled
                        fullWidth={true}
                        label={intl.translate({ id: 'person.email' })}
                        value={personInfo?.email}
                        variant='outlined'
                      />
                    </Grid>
                  </Grid>
                ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default PersonPage;
