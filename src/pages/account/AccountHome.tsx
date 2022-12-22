import loadable from '@loadable/component';
import { Box, Card, CardContent, CardHeader, Grid, Skeleton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { IPost } from 'pages/posts/data/post-types';
import NewPost from 'pages/posts/ui/NewPost';
import { postsOwnedSelector, postsPhaseSelector } from 'pages/posts/services/posts';

import { authUserSelector } from 'store/auth';
import { postActions } from 'pages/posts/services/actions';

const Post = loadable(() => import('pages/posts/ui/Post'));
const About = loadable(() => import('./profile/About'));

const AccountHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page] = React.useState(1);

  const user = useSelector(authUserSelector);
  const postsOwned = useSelector(postsOwnedSelector);
  const postsPhase = useSelector(postsPhaseSelector);

  const handleCloseDialog = () => {
    navigate('/account/home');
  };

  React.useEffect(() => {
    dispatch(postActions.getPosts(user, page));

    return () => null;
  }, [user, page]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <NewPost handleClose={handleCloseDialog} />

          {(postsPhase !== 'loading' &&
            postsOwned?.map((post: IPost) => (
              <Box mt={3} key={post.id}>
                <Post post={post} />
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
