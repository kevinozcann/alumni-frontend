import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Box, useTheme } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import { authUserSelector } from 'store/auth';
import { i18nLangSelector } from 'store/i18n';
import {
  userActions,
  userSchoolsSelector,
  userActiveSchoolSelector,
  userActiveSeasonSelector
} from 'store/user';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import BreadCrumbs from 'components/BreadCrumbs';
import SchoolsPopover from 'components/SchoolsPopover';
import SeasonsPopover from 'components/SeasonsPopover';
import { TLang } from 'utils/shared-types';
import { IUser } from 'pages/auth/data/account-types';
import { ISchool, ISeason } from 'pages/organization/organization-types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  schools: userSchoolsSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setActiveSchool: (lang: TLang, user: IUser, school: ISchool) =>
    dispatch(userActions.setActiveSchool(lang, user, school)),
  setActiveSeason: (season: ISeason) => dispatch(userActions.setActiveSeason(season))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TSubNavbarProps = PropsFromRedux;

const SubNavbar = (props: TSubNavbarProps) => {
  const { lang, user, schools, activeSchool, activeSeason, setActiveSchool, setActiveSeason } =
    props;
  const theme = useTheme();
  const subheader = useSubheader();
  const intl = useTranslation();

  const changeSchool = (school: ISchool) => {
    // setActiveSchool(lang, user, school);
  };

  const changeSeason = (season: ISeason) => {
    setActiveSeason(season);
  };

  return (
    <Box
      sx={{
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap'
      }}
    >
      <Box
        sx={{
          px: 2,
          width: '100%',
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'nowrap',
          [theme.breakpoints.up('sm')]: {
            px: 3,
            justifyContent: 'space-between'
          }
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            flexWrap: 'nowrap',
            flexGrow: 1
          }}
        >
          <BreadCrumbs breadcrumbs={subheader.breadcrumbs} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            [theme.breakpoints.up('sm')]: {
              justifyContent: 'flex-end'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline'
            }}
          >
            {schools && (
              <SchoolsPopover
                headerText={intl.formatMessage({ id: 'app.select_school_long' })}
                align='right'
                schools={schools}
                activeSchool={activeSchool}
                changeSchool={changeSchool}
              />
            )}
          </Box>

          <Box sx={{ width: '8px' }} />

          {activeSchool?.seasons && (
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <SeasonsPopover
                itemKey={activeSeason && activeSeason.title}
                activeSchool={activeSchool}
                activeSeason={activeSeason}
                headerText={intl.formatMessage({ id: 'app.select_season_long' })}
                align='right'
                changeSeason={changeSeason}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default connector(SubNavbar);
