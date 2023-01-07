import loadable from '@loadable/component';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IUser } from 'pages/profile/data/user-types';
import { userProfileSelector } from 'pages/profile/services/store/selectors';
import { i18nLangSelector } from 'store/i18n';
import { IPost } from '../data/post-types';
import { postsPhaseSelector } from '../services/store/selectors';

const Comment = loadable(() => import('./Comment'));
const NewComment = loadable(() => import('./NewComment'));

type TPostComments = {
  post: IPost;
};

const PostComments = (props: TPostComments) => {
  const { post } = props;

  return (
    <Box sx={{ paddingX: 3, paddingBottom: 2 }}>
      {post?.comments && post?.comments?.items && post?.comments?.items?.length > 0 && (
        <>
          <Box sx={{ marginY: 2 }}>
            <Divider />
          </Box>

          {post?.comments?.items?.map((item) => (
            <Comment key={item.id} post={post} comment={item} />
          ))}
        </>
      )}

      <Divider sx={{ marginBottom: 1 }} />

      <NewComment post={post} />
    </Box>
  );
};

export default PostComments;
