import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';
import loadable from '@loadable/component';
import { Box, Card, CardContent, CardHeader, Grid, Skeleton } from '@mui/material';

import { AppDispatch, RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { TActionType } from 'utils/shared-types';
import { ISchool } from 'pages/organization/organization-types';
import { IFeed } from 'pages/feeds/feed-types';
import NewFeed from 'pages/feeds/NewFeed';
import { feedActions, feedsOwnedSelector, feedsPhaseSelector } from 'pages/feeds/_store/feeds';

import { IUser } from './account-types';
import { IStudent } from 'pages/students/_store/types';

import StudentInstallments from './profile/StudentInstallments';
import { userActiveStudentSelector } from 'store/user';
import {
  installmentsSelector,
  installmentsPhaseSelector,
  installmentsActions
} from 'pages/installment/_store/installment';
// import { PersonalInfo } from './PersonalInfo';
// import { CommInfo } from './CommInfo';
// import { EmergencyContact } from './EmergencyContact';
// import { TwitterFeeds } from './TwitterFeeds';
// import { Posts } from './Posts';
// import Suggestions from './Suggestions';
// import Polls from './Polls';

const Feed = loadable(() => import('pages/feeds/Feed'));
const About = loadable(() => import('./profile/About'));
const LinkedAccounts = loadable(() => import('./profile/LinkedAccounts'));

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  feedsOwned: feedsOwnedSelector(state),
  feedsPhase: feedsPhaseSelector(state),
  activeStudent: userActiveStudentSelector(state),
  installments: installmentsSelector(state),
  installmentsPhase: installmentsPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullFeeds: (user: IUser, page: number) => dispatch(feedActions.pullFeeds(user, page)),
  saveFeed: (user: IUser, feed: IFeed, actionType: TActionType) =>
    dispatch(feedActions.saveFeed(user, feed, actionType)),
  pullStudentInstallments: (student: IStudent) =>
    dispatch(installmentsActions.pullStudentInstallments(student))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAccountHomeProps = PropsFromRedux & {
  user: IUser;
  schools: ISchool[];
  activeSchool: ISchool;
};

const AccountHome: React.FC<TAccountHomeProps> = (props) => {
  const {
    lang,
    user,
    activeSchool,
    feedsOwned,
    feedsPhase,
    activeStudent,
    installments,
    installmentsPhase,
    pullFeeds,
    saveFeed,
    pullStudentInstallments
  } = props;
  const [page] = React.useState(1);
  const navigate = useNavigate();

  // Handle feed adding/updating
  const handleSaveFeed = React.useCallback(
    (user, feed, actionType) => {
      saveFeed(user, feed, actionType);
    },
    [saveFeed]
  );

  const handleCloseDialog = () => {
    navigate('/account/home');
  };

  React.useEffect(() => {
    pullFeeds(user, page);

    return () => null;
  }, [user, page]);

  if (user?.userType?.id && activeStudent) {
    React.useEffect(() => {
      pullStudentInstallments(activeStudent);
    }, [activeStudent]);
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <NewFeed handleClose={handleCloseDialog} />

          {(feedsPhase !== 'loading' &&
            feedsOwned?.map((feed: IFeed) => (
              <Box mt={3} key={feed.id}>
                <Feed
                  lang={lang}
                  user={user}
                  feed={feed}
                  phase={feedsPhase}
                  handleSaveFeed={handleSaveFeed}
                />
              </Box>
            ))) || (
            <Card sx={{ marginTop: 3 }}>
              <CardHeader
                avatar={<Skeleton animation='wave' variant='circular' width={40} height={40} />}
                title={
                  <Skeleton animation='wave' height={10} width='80%' style={{ marginBottom: 6 }} />
                }
                subheader={<Skeleton animation='wave' height={10} width='40%' />}
              />
              <Skeleton animation='wave' variant='rectangular' style={{ height: 150 }} />

              <CardContent>
                <React.Fragment>
                  <Skeleton animation='wave' height={10} style={{ marginBottom: 6 }} />
                  <Skeleton animation='wave' height={10} width='80%' />
                </React.Fragment>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <About user={user} activeSchool={activeSchool} />
            </Grid>
            {user?.userType?.id === 9 && installments.length > 0 ? (
              <Grid item xs={12}>
                <StudentInstallments
                  installments={installments}
                  installmentsPhase={installmentsPhase}
                />
              </Grid>
            ) : (
              ''
            )}
            <Grid item xs={12}>
              <LinkedAccounts />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default connector(AccountHome);
