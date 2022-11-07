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

const clientId = 'xncinfumkd4ya234';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state)
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TVCloudProps = PropsFromRedux;

const VCloudSSO = (props: TVCloudProps) => {
  const { user } = props;
  const { settings } = useSettings();
  const navigate = useNavigate();
  const intl = useTranslation();
  const subheader = useSubheader();
  const [token, setToken] = React.useState<string>('');
  const [ssoUrl, setSsoUrl] = React.useState<string>('');

  const isStudent = user.userType.loginType === 'student';

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'partner.vcloud', url: '/vcloud' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  React.useEffect(() => {
    const jwtSign = async () => {
      const secretKey = new TextEncoder().encode('2FsscC1f75BcJ7gVJdZ6mEEeRP8=');

      const jwtToken = await new jose.SignJWT({
        'urn:sebitcloud:claim': true,
        uniqKey: user.uuid
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('urn:sebitcloud:issuer')
        .setAudience('urn:sebitcloud:audience')
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
      setSsoUrl(`https://www.sebitvcloud.com/login/sso?client_id=${clientId}&token=${token}`);
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
                {intl.translate({ id: 'partner.connected' }, { name: 'VCloud' })}{' '}
                <a href={ssoUrl} target='_blank' rel='noreferrer'>
                  VCloud
                </a>
              </Alert>
            )) || (
              <Alert severity='info'>
                {intl.translate({ id: 'partner.connecting' }, { name: 'VCloud' })}
              </Alert>
            )}
        </Box>
      </Box>
    </Page>
  );
};

export default connector(VCloudSSO);
