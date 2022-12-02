import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';
import { Alert, Box } from '@mui/material';
import * as jose from 'jose';

import Page from 'layout/Page';
import useSettings from 'hooks/useSettings';
import { RootState } from 'store/store';
import { authUserSelector } from 'store/auth';
import { useSubheader } from 'contexts/SubheaderContext';
import useTranslation from 'hooks/useTranslation';

const clientId = 'xyz';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state)
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TVCloudProps = PropsFromRedux;

const PartnerSSO = (props: TVCloudProps) => {
  const { user } = props;
  const { settings } = useSettings();
  const navigate = useNavigate();
  const intl = useTranslation();
  const subheader = useSubheader();
  const [token, setToken] = React.useState<string>('');
  const [ssoUrl, setSsoUrl] = React.useState<string>('');

  const isStudent = user.userType.loginType === 'student';

  React.useEffect(() => {
    const jwtSign = async () => {
      const secretKey = new TextEncoder().encode('abc');

      const jwtToken = await new jose.SignJWT({
        'urn:partner:claim': true,
        uniqKey: user.uuid
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('urn:partner:issuer')
        .setAudience('urn:partner:audience')
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secretKey);

      return jwtToken;
    };

    if (isStudent) {
      jwtSign().then((token) => setToken(token));
    }
  }, []);

  React.useEffect(() => {
    if (isStudent && token !== '' && ssoUrl === '') {
      setSsoUrl(`partner-url?client_id=${clientId}&token=${token}`);
    }
  }, [token]);

  React.useEffect(() => {
    if (isStudent && ssoUrl !== '') {
      window.open(ssoUrl, '_blank');
    }
  }, [ssoUrl]);

  React.useEffect(() => {
    setTimeout(() => {
      navigate('account/home');
    }, 60000);
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'store.store' })}>
      <Box
        sx={{
          display: 'flex',
          height: `calc(100vh - ${settings.mainHeightGutter}px)`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box sx={{ width: '100%' }}>
          {(!isStudent && (
            <Alert severity='warning'>{intl.translate({ id: 'partner.only_student' })}</Alert>
          )) ||
            (token && (
              <Alert severity='success'>
                {intl.translate({ id: 'partner.connected' }, { name: 'Partner' })}{' '}
                <a href={ssoUrl} target='_blank' rel='noreferrer'>
                  VCloud
                </a>
              </Alert>
            )) || (
              <Alert severity='info'>
                {intl.translate({ id: 'partner.connecting' }, { name: 'Partner' })}
              </Alert>
            )}
        </Box>
      </Box>
    </Page>
  );
};

export default connector(PartnerSSO);
