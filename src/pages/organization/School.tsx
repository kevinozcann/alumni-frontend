import React from 'react';
import { lazy } from '@loadable/component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';

import { Box, Card, CardContent, Divider, Grid, Skeleton, Tab, Tabs } from '@mui/material';

import Page from 'layout/Page';
import { LoadableScreen } from 'layout';
import { configActions, configPhaseSelector, gradeLevelsSelector } from 'store/config';
import { authUserSelector } from 'pages/auth/services/store/auth';
import { i18nLangSelector } from 'store/i18n';
import { citiesSelector, countriesSelector, statesSelector, staticActions } from 'store/static';
import { TLang, IPageTab } from 'utils/shared-types';
import { useSubheader } from 'contexts/SubheaderContext';
import { IAuthUser } from 'pages/auth/data/account-types';

import { schoolActions, schoolPhaseSelector, schoolSelector } from './_store/school';
import { ISchool, TConfiguration } from './organization-types';
import pageTabs from './page-tabs';

const General = LoadableScreen(lazy(() => import('./edit/General')));
const Contact = LoadableScreen(lazy(() => import('./edit/Contact')));
const Images = LoadableScreen(lazy(() => import('./edit/Images')));
const Schools = LoadableScreen(lazy(() => import('./edit/Schools')));
const Seasons = LoadableScreen(lazy(() => import('./edit/Seasons')));
const Grades = LoadableScreen(lazy(() => import('./edit/Grades')));
const Config = LoadableScreen(lazy(() => import('./edit/Config')));

const School = () => {
  const { id, section, action } = useParams();
  const subheader = useSubheader();
  const navigate = useNavigate();
  const intl = useIntl();

  // selectors
  const lang = useSelector(i18nLangSelector);
  const user = useSelector(authUserSelector);
  const configPhase = useSelector(configPhaseSelector);
  const schoolPhase = useSelector(schoolPhaseSelector);
  const schoolInfo = useSelector(schoolSelector);
  const countries = useSelector(countriesSelector);
  const states = useSelector(statesSelector);
  const cities = useSelector(citiesSelector);
  const gradeLevels = useSelector(gradeLevelsSelector);

  // dispatchers
  const dispatch = useDispatch();
  const pullSchoolInfo = (schoolId: number) => dispatch(schoolActions.pullSchoolInfo(schoolId));
  const pullCountries = () => dispatch(staticActions.pullCountries());
  const pullStates = (countryId: string) => dispatch(staticActions.pullStates(countryId));
  const pullCities = (stateId: number) => dispatch(staticActions.pullCities(stateId));
  const pullGradeLevels = (active: boolean) => dispatch(configActions.pullGradeLevels(active));
  const updateConfig = (configInfo: TConfiguration, idToDelete?: number) =>
    dispatch(configActions.updateConfig(configInfo, idToDelete));
  const saveSchoolInfo = (user: IAuthUser, lang: TLang, schoolId: number, schoolInfo: ISchool) =>
    dispatch(schoolActions.saveSchoolInfo(user, lang, schoolId, schoolInfo));
  const deleteSchool = (user: IAuthUser, lang: TLang, activeSchoolId: number, schoolId: number) =>
    dispatch(schoolActions.deleteSchool(user, lang, activeSchoolId, schoolId));
  const resetConfigPhase = () => dispatch(configActions.setPhase(null));

  // Handle tab change by user
  const handleTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    // navigate(`/organization/${activeSchool.id}/${newValue}`);
  };

  return (
    <Page title={intl.formatMessage({ id: 'organization' })}>
      <Helmet>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`}
        />
      </Helmet>
      <Box>
        <Tabs
          value={section}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          scrollButtons='auto'
          variant='scrollable'
          aria-label='page tabs'
        >
          {pageTabs
            // .filter((t) => t.visible.includes(activeSchool.type))
            .map((tab: IPageTab) => (
              <Tab
                key={tab.value}
                label={intl.formatMessage({ id: tab.label })}
                value={tab.value}
              />
            ))}
        </Tabs>
      </Box>

      <Divider />

      <Box sx={{ mt: 3 }}>
        {(schoolPhase === 'loading' && (
          <Card>
            <Skeleton sx={{ m: 2 }} height={30} width='30%' variant='text' />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Skeleton height={45} width='100%' variant='rectangular' />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton height={45} width='100%' variant='rectangular' />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton height={45} width='100%' variant='rectangular' />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton height={45} width='100%' variant='rectangular' />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )) ||
          (section === 'general' && (
            <General
              user={user}
              lang={lang}
              phase={schoolPhase}
              schoolInfo={schoolInfo}
              updateConfig={updateConfig}
              saveSchoolInfo={saveSchoolInfo}
            />
          )) ||
          (section === 'contact' && (
            <Contact
              user={user}
              lang={lang}
              phase={schoolPhase}
              schoolInfo={schoolInfo}
              countries={countries}
              states={states}
              cities={cities}
              saveSchoolInfo={saveSchoolInfo}
              pullCountries={pullCountries}
              pullStates={pullStates}
              pullCities={pullCities}
            />
          )) ||
          (section === 'images' && (
            <Images
              user={user}
              lang={lang}
              phase={schoolPhase}
              schoolInfo={schoolInfo}
              updateConfig={updateConfig}
              saveSchoolInfo={saveSchoolInfo}
            />
          )) ||
          (section === 'seasons' && <Seasons saveSchoolInfo={saveSchoolInfo} />) ||
          (section === 'schools' && (
            <Schools
              user={user}
              lang={lang}
              phase={schoolPhase}
              schoolInfo={schoolInfo}
              deleteSchool={deleteSchool}
            />
          )) ||
          (section === 'grades' && (
            <Grades
              user={user}
              lang={lang}
              phase={schoolPhase}
              schoolInfo={schoolInfo}
              gradeLevels={gradeLevels}
              saveSchoolInfo={saveSchoolInfo}
            />
          )) ||
          (section === 'config' && (
            <Config
              user={user}
              lang={lang}
              phase={configPhase}
              schoolInfo={schoolInfo}
              resetPhase={resetConfigPhase}
              updateConfig={updateConfig}
            />
          ))}
      </Box>
    </Page>
  );
};

export default School;
