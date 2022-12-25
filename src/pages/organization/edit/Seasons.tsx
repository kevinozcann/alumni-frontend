import { faCheckCircle, faPlus, faSync } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import loadable, { lazy } from '@loadable/component';
import { Box } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import ConfirmDialog from 'components/ConfirmDialog';
import useTranslation from 'hooks/useTranslation';
import { Loadable } from 'layout';
import { IUser } from 'pages/auth/data/account-types';
import { authUserSelector } from 'pages/auth/services/store/auth';
import { schoolSelector } from 'pages/organization/_store/school';
import { userActions } from 'pages/profile/services/actions';
import { userPhaseSelector } from 'pages/profile/services/store/user';
import { configActions, configPhaseSelector } from 'store/config';
import { i18nLangSelector } from 'store/i18n';
import { TLang } from 'utils/shared-types';

const SchoostDialog = loadable(() => import('components/SchoostDialog'));
const DefaultSeason = Loadable(lazy(() => import('pages/organization/edit/DefaultSeason')));
const CopySeasonData = Loadable(lazy(() => import('pages/organization/edit/CopySeasonData')));

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
  const schoolInfo = useSelector(schoolSelector);

  // Dispatchers
  const deleteSeason = (lang: TLang, user: IUser, seasonId: number) =>
    dispatch(configActions.deleteSeason(lang, user, seasonId));

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
      startIcon: <FontAwesomeIcon icon={faSync} spin={userPhase?.includes('ing')} />
      // onClick: () => updateUserSchools(lang, user)
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

  return (
    <Box>
      {action === 'delete' && (
        <ConfirmDialog
          handleClose={handleDialogClose}
          handleConfirm={handleDeleteConfirm}
          isOpen={action === 'delete'}
          phase={configPhase}
        />
      )}
    </Box>
  );
};

export default Seasons;
