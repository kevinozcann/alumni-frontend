import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import loadable, { lazy } from '@loadable/component';
import { Box, Card, CardHeader, Divider, CardContent } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlus, faSync } from '@fortawesome/pro-duotone-svg-icons';

import { Loadable } from 'layout';
import { i18nLangSelector } from 'store/i18n';
import { authUserSelector } from 'store/auth';
import { userActions, userActiveSchoolSelector, userPhaseSelector } from 'store/user';
import { configActions, configPhaseSelector } from 'store/config';
import useTranslation from 'hooks/useTranslation';
import ResponsiveActions from 'components/ResponsiveActions';
import ConfirmDialog from 'components/ConfirmDialog';
import { TLang } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';
import { schoolSelector } from 'pages/organization/_store/school';
import ViewSeasons from 'pages/organization/view/ViewSeasons';

const SchoostDialog = loadable(() => import('components/SchoostDialog'));
const GradingTerms = loadable(() => import('pages/organization/edit/GradingTerms'));
const DefaultSeason = Loadable(lazy(() => import('pages/organization/edit/DefaultSeason')));
const CopySeasonData = Loadable(lazy(() => import('pages/organization/edit/CopySeasonData')));
const GradingTermForm = Loadable(lazy(() => import('pages/organization/add/GradingTermForm')));

const Seasons = () => {
  const { action, subsection, subaction } = useParams(); // @note: subsection is season id here
  const [isDeleted, setDeleted] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const intl = useTranslation();
  const dispatch = useDispatch();

  // Selectors
  const lang = useSelector(i18nLangSelector);
  const user = useSelector(authUserSelector);
  const userPhase = useSelector(userPhaseSelector);
  const configPhase = useSelector(configPhaseSelector);
  const activeSchool = useSelector(userActiveSchoolSelector);
  const schoolInfo = useSelector(schoolSelector);

  // Dispatchers
  const updateUserSchools = (lang: TLang, user: IUser) =>
    dispatch(userActions.updateUserSchools(lang, user));
  const deleteSeason = (lang: TLang, user: IUser, seasonId: number) =>
    dispatch(configActions.deleteSeason(lang, user, seasonId));

  const { id, type, config, seasons } = activeSchool;

  const transSeason = intl.translate({ id: 'season' });
  const transGradingTerm = intl.translate({ id: 'gradings.term' });

  const handleDeleteConfirm = () => {
    setDeleted(true);
    deleteSeason(lang, user, parseInt(subsection));
  };

  const handleDialogClose = () => {
    navigate(`/organization/${schoolInfo.id}/seasons`);
  };

  React.useEffect(() => {
    if (subsection && isDeleted && configPhase === 'success') {
      handleDialogClose();
    }
  }, [subsection, configPhase]);

  React.useEffect(() => {
    dispatch(configActions.setPhase(null));
    dispatch(userActions.setPhase(null, null));
  }, []);

  const headerActions = [
    {
      key: 'reload',
      title: intl.translate({ id: 'app.reload' }),
      startIcon: <FontAwesomeIcon icon={faSync} spin={userPhase?.includes('ing')} />,
      onClick: () => updateUserSchools(lang, user)
    },
    {
      key: 'set-default',
      title: intl.translate({ id: 'season.set.default' }),
      startIcon: <FontAwesomeIcon icon={faCheckCircle} />,
      navigate: `/organization/${schoolInfo.id}/seasons/set-default`
    },
    // {
    //   key: 'copy-data',
    //   title: intl.translate({ id: 'season.copy.data' }),
    //   startIcon: <FontAwesomeIcon icon={faCopy} />,
    //   navigate: `/organization/${schoolInfo.id}/seasons/copy-data`
    // },
    {
      key: 'add-season',
      title: intl.translate({ id: 'app.add.something' }, { something: transSeason }),
      startIcon: <FontAwesomeIcon icon={faPlus} />,
      navigate: `/organization/${schoolInfo.id}/seasons/new`
    }
  ];

  const showit = false; // @TODO remove this when it is ready to add to all schools
  if (type !== 'school' && config.institutionType === 'k12' && showit) {
    headerActions.push({
      key: 'add-grading-term',
      title: intl.translate({ id: 'app.add.something' }, { something: transGradingTerm }),
      startIcon: <FontAwesomeIcon icon={faPlus} />,
      navigate: `/organization/${id}/seasons/view/grading-terms/new`
    });
  }

  return (
    <Box>
      <Card>
        <CardHeader
          title={intl.formatMessage({ id: 'school.seasons' })}
          action={<ResponsiveActions actions={headerActions} />}
        />
        <Divider />

        <CardContent>
          <ViewSeasons seasons={seasons} />
        </CardContent>
      </Card>

      <Box sx={{ height: '24px' }} />

      {type === 'school' && config.institutionType === 'k12' && <GradingTerms />}

      {/* Season Delete Confirm */}
      {action === 'delete' && (
        <ConfirmDialog
          handleClose={handleDialogClose}
          handleConfirm={handleDeleteConfirm}
          isOpen={action === 'delete'}
          phase={configPhase}
        />
      )}

      {/* Set Default Season */}
      {action === 'set-default' && (
        <SchoostDialog
          width={300}
          title={intl.translate({ id: 'season.set.default' })}
          isOpen={action === 'set-default'}
          dividers={true}
          handleClose={handleDialogClose}
        >
          <DefaultSeason activeSchool={activeSchool} handleClose={handleDialogClose} />
        </SchoostDialog>
      )}

      {/* Copy Season Data */}
      {action === 'copy-data' && (
        <SchoostDialog
          title={intl.translate({ id: 'season.copy.data' })}
          isOpen={action === 'copy-data'}
          dividers={true}
          handleClose={handleDialogClose}
        >
          <CopySeasonData handleClose={handleDialogClose} />
        </SchoostDialog>
      )}

      {/* Add grading term */}
      {subsection === 'grading-terms' && subaction === 'new' && (
        <SchoostDialog
          title={intl.translate({ id: 'app.add.something' }, { something: transGradingTerm })}
          isOpen={subsection === 'grading-terms' && subaction === 'new'}
          dividers={true}
          handleClose={handleDialogClose}
        >
          <GradingTermForm handleClose={handleDialogClose} />
        </SchoostDialog>
      )}
    </Box>
  );
};

export default Seasons;
