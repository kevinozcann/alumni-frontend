import loadable from '@loadable/component';
import { Box, Card, CardContent, CardHeader, Grid, Skeleton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { IFeed } from 'pages/feeds/feed-types';
import NewFeed from 'pages/feeds/NewFeed';
import { feedActions, feedsOwnedSelector, feedsPhaseSelector } from 'pages/feeds/_store/feeds';

import { authUserSelector } from 'store/auth';

const Feed = loadable(() => import('pages/feeds/Feed'));
const About = loadable(() => import('./profile/About'));

const AccountHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page] = React.useState(1);

  const user = useSelector(authUserSelector);
  const feedsOwned = useSelector(feedsOwnedSelector);
  const feedsPhase = useSelector(feedsPhaseSelector);

  const handleCloseDialog = () => {
    navigate('/account/home');
  };

  React.useEffect(() => {
    dispatch(feedActions.pullFeeds(user, page));

    return () => null;
  }, [user, page]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <NewFeed handleClose={handleCloseDialog} />

          {(feedsPhase !== 'loading' &&
            feedsOwned?.map((feed: IFeed) => (
              <Box mt={3} key={feed.id}>
                <Feed feed={feed} />
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
      </Grid>
    </Box>
  );
};

export default AccountHome;
