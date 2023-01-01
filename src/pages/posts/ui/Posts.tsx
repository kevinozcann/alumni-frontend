import Box from '@mui/material/Box';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userProfileSelector } from 'pages/profile/services/store/selectors';

import { IPost } from '../data/post-types';
import { postActions } from '../services/actions';
import { postsPhaseSelector, postsItemsSelector } from '../services/store/selectors';
import Post from './Post';
import PostsSkeleton from './PostsSkeleton';

const Posts = () => {
  const dispatch = useDispatch();
  const [page] = React.useState(1);

  const user = useSelector(userProfileSelector);
  const postsPosts = useSelector(postsItemsSelector);
  const postsPhase = useSelector(postsPhaseSelector);

  React.useEffect(() => {
    dispatch(postActions.getPosts(user, page));
  }, [page]);

  return (
    <Box>
      {(postsPhase === 'loading' && <PostsSkeleton />) ||
        postsPosts?.map((post: IPost) => (
          <Box mt={3} key={post.id}>
            <Post post={post} />
          </Box>
        ))}
    </Box>
  );
};

export default Posts;
