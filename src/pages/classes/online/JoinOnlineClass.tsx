import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { useParams } from 'react-router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-duotone-svg-icons';

import { AppDispatch, RootState } from 'store/store';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'store/user';
import useTranslation from 'hooks/useTranslation';
import { IOnlineClass } from 'pages/classes/_store/types';

import { onlineClassesActions, onlineClassesDataSelector } from './_store/onlineClasses';
import { i18nLangSelector } from 'store/i18n';
import { TLang } from 'utils/shared-types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  onlineClassesData: onlineClassesDataSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  getProviderClass: (lang: TLang, role: string, classInfo: IOnlineClass) =>
    dispatch(onlineClassesActions.getProviderClass(lang, role, classInfo)),
  resetPhase: () => dispatch(onlineClassesActions.setPhase(null))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TFormProps = PropsFromRedux & {
  handleClose?: () => void;
};

const JoinOnlineClass = (props: TFormProps) => {
  const { id, role } = useParams();
  const { lang, onlineClassesData, getProviderClass, resetPhase } = props;
  const { onlineClasses, providerClass, phase } = onlineClassesData;
  const intl = useTranslation();

  const onlineClassInfo: IOnlineClass = onlineClasses.find((g) => g.id === parseInt(id));

  React.useEffect(() => {
    if (providerClass?.joinUrl) {
      window.location = providerClass?.joinUrl;
    }
  }, [providerClass]);

  React.useEffect(() => {
    resetPhase();
    getProviderClass(lang, role, onlineClassInfo);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        height: 200
      }}
    >
      {(providerClass && <FontAwesomeIcon icon={faCheckCircle} size='3x' />) || (
        <CircularProgress />
      )}
      <Typography>
        {!providerClass &&
          phase === 'loading' &&
          intl.translate({ id: 'online.class.connecting.provider' })}
        {!providerClass && phase === 'adding' && intl.translate({ id: 'online.class.creating' })}
        {!providerClass && phase === 'updating' && intl.translate({ id: 'online.class.getting' })}
        {providerClass && intl.translate({ id: 'online.class.joining' })}
      </Typography>
    </Box>
  );
};

export default connector(JoinOnlineClass);
