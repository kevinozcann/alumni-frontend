import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router-dom';
import Iframe from 'react-iframe';
import { Alert, AlertTitle, Box } from '@mui/material';

import Page from 'layout/Page';
import { RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { authUserSelector } from 'store/auth';
import {
  userActiveSchoolSelector,
  userActiveSeasonSelector,
  userActiveStudentSelector
} from 'store/user';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';
import useSettings from 'hooks/useSettings';
import { generateApiLegacyUrl } from 'utils/Helpers';

export const SMARTCLASS_LEGACY_URL =
  (process.env.NODE_ENV === 'production' &&
    window &&
    window.location &&
    generateApiLegacyUrl(window.location.host, 'legacy')) ||
  process.env.REACT_APP_SMARTCLASS_LEGACY_URL;

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state),
  activeStudent: userActiveStudentSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TSmartClassProps = PropsFromRedux;

const SmartClass = ({
  lang,
  user,
  activeSchool,
  activeSeason,
  activeStudent
}: TSmartClassProps) => {
  const { op } = useParams();
  const { settings } = useSettings();
  const [iframeUrl, setIframeUrl] = React.useState<string>('');
  const intl = useTranslation();
  const subheader = useSubheader();

  React.useEffect(() => {
    let urlParams = `op=${op}&frontend=1&accessToken=${user?.accessToken}&newlang=${lang}&schoolId=${activeSchool?.id}&seasonId=${activeSeason?.database}`;
    urlParams = (activeStudent && `${urlParams}&studentId=${activeStudent.id}`) || urlParams;

    const url =
      process.env.NODE_ENV === 'production'
        ? `https://${SMARTCLASS_LEGACY_URL}/index.php?${urlParams}`
        : `${SMARTCLASS_LEGACY_URL}/index.php?${urlParams}`;

    setIframeUrl(url);
  }, [op, lang, user, activeSchool, activeSeason, activeStudent, SMARTCLASS_LEGACY_URL]);

  React.useEffect(() => {
    subheader.setBreadcrumbs([]);
  }, []);

  return (
    <Page title='SmartClass'>
      <Box
        sx={{
          display: 'flex',
          height: `calc(100vh - ${settings.mainHeightGutter}px)`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {(activeSchool && activeSeason && (
          <Iframe
            url={iframeUrl}
            width='100%'
            height='100%'
            id='smartclass'
            display='inline'
            position='relative'
            loading='lazy'
            frameBorder={0}
          />
        )) || (
          <Alert sx={{ width: '100%', height: 80 }} variant='outlined' severity='warning'>
            <AlertTitle>{intl.formatMessage({ id: 'app.warning' })}</AlertTitle>
            {intl.formatMessage({ id: 'smartclass.school_or_season_not_available' })}
          </Alert>
        )}
      </Box>
    </Page>
  );
};

export default connector(SmartClass);
