import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Typography
} from '@mui/material';

import Page from 'layout/Page';
import { useSubheader } from 'contexts/SubheaderContext';
import SearchForm from 'components/SearchForm';
import UserAvatar from 'components/UserAvatar';
import { i18nLangSelector } from 'store/i18n';
import { AppDispatch, RootState } from 'store/store';
import { searchActions, searchUsersSelector } from 'store/search';
import {
  authAccountsImpersonatesSelector,
  authActions,
  authPhaseSelector,
  authUserSelector
} from 'store/auth';
import { TLang } from 'utils/shared-types';
import useKeyPress from 'hooks/useKeypress';
import { IUser } from 'pages/account/account-types';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  phase: authPhaseSelector(state),
  accountImpersonates: authAccountsImpersonatesSelector(state),
  userResults: searchUsersSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setPhase: (phase: string) => dispatch(authActions.setPhase(phase, null)),
  impersonate: (lang: TLang, user: IUser, impersonateUser: IUser) =>
    dispatch(authActions.impersonate(lang, user, impersonateUser)),
  searchUsers: (lang: TLang, userId: string, searchKey: string, userTypes: string) =>
    dispatch(searchActions.searchUsers(lang, userId, searchKey, userTypes, true))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TImpersonateProps = PropsFromRedux;

const Impersonate: React.FC<TImpersonateProps> = (props) => {
  const {
    lang,
    user,
    phase,
    accountImpersonates,
    userResults,
    impersonate,
    setPhase,
    searchUsers
  } = props;
  const [searchKey, setSearchKey] = React.useState<string>();
  const [selectedUserId, setSelectedUserId] = React.useState<string>(null);
  const navigate = useNavigate();
  const subheader = useSubheader();
  const intl = useIntl();
  const enter = useKeyPress('Enter');

  const handleSearchClick = (): void => {
    if (searchKey.length === 0) {
      return;
    }

    // Search for users
    searchUsers(lang, user.uuid, searchKey, '6,8,9'); // teacher, parent, student
  };

  const handleImpersonate = React.useCallback((event, impersonateUser: IUser) => {
    setSelectedUserId(impersonateUser.uuid);
    impersonate(lang, user, impersonateUser);
  }, []);

  React.useEffect(() => {
    if (enter) {
      handleSearchClick();
    }
  }, [enter]);

  React.useEffect(() => {
    if (phase === 'impersonate-successful') {
      navigate('/account/home');
    }
  }, [phase]);

  React.useEffect(() => {
    setPhase('');
  }, []);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'account.myaccount', url: '/account' });
    breadcrumbs.push({ title: 'account.impersonate', url: '/account/impersonate' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={intl.formatMessage({ id: 'account.impersonate' })}>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%'
        }}
      >
        <Card>
          <CardHeader
            title={intl.formatMessage({ id: 'account.impersonate' })}
            subheader={intl.formatMessage({ id: 'account.impersonate.search_description' })}
          />
          <Divider />

          <CardContent>
            <SearchForm
              searchKey={searchKey}
              setSearchKey={setSearchKey}
              handleSearchClick={handleSearchClick}
            />
          </CardContent>

          <CardContent>
            <Grid container spacing={3}>
              {userResults?.map((userResult: IUser) => (
                <Grid key={userResult.uuid} item xs={12} md={6}>
                  <Card>
                    <CardActions disableSpacing>
                      <UserAvatar
                        user={userResult}
                        showTitle
                        showSubTitle
                        cardHeaderSx={{ p: 0.4 }}
                        cardSx={{
                          borderRadius: '0px',
                          boxShadow: 'none',
                          backgroundColor: 'transparent'
                        }}
                        avatarSx={{ width: '30px', height: '30px' }}
                      />
                      <Box sx={{ ml: 'auto' }} />
                      <Button
                        startIcon={
                          (selectedUserId === userResult.uuid && phase && phase.includes('ing') && (
                            <CircularProgress size={18} />
                          )) ||
                          null
                        }
                        style={{ marginRight: 5 }}
                        onClick={(event) => handleImpersonate(event, userResult)}
                      >
                        {intl.formatMessage({
                          id:
                            (selectedUserId === userResult.uuid &&
                              phase &&
                              phase.includes('ing') &&
                              'app.processing') ||
                            'account.impersonate'
                        })}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>

          {accountImpersonates && (
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='body1'>
                    {intl.formatMessage({ id: 'account.impersonate.recent_accounts' })}
                  </Typography>
                </Grid>

                {accountImpersonates?.map((impUser: IUser) => (
                  <Grid key={impUser.uuid} item xs={12} md={6}>
                    <Card>
                      <CardActions disableSpacing>
                        <UserAvatar
                          user={impUser}
                          showTitle
                          showSubTitle
                          cardHeaderSx={{ p: 0.4 }}
                          cardSx={{
                            borderRadius: '0px',
                            boxShadow: 'none',
                            backgroundColor: 'transparent'
                          }}
                          avatarSx={{ width: '30px', height: '30px' }}
                        />
                        <Box sx={{ ml: 'auto' }} />
                        <Button
                          startIcon={
                            (selectedUserId === impUser.uuid && phase && phase.includes('ing') && (
                              <CircularProgress size={18} />
                            )) ||
                            null
                          }
                          style={{ marginRight: 5 }}
                          onClick={(event) => handleImpersonate(event, impUser)}
                        >
                          {intl.formatMessage({
                            id:
                              (selectedUserId === impUser.uuid &&
                                phase &&
                                phase.includes('ing') &&
                                'app.processing') ||
                              'account.impersonate'
                          })}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          )}
        </Card>
      </Box>
    </Page>
  );
};

export default connector(Impersonate);
