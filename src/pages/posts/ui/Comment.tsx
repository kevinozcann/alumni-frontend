import React from 'react';
import moment from 'moment';
import { Avatar, Box, Typography, Fab, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';

import useTranslation from 'hooks/useTranslation';
import InlineEdit from 'components/InlineEdit';
import ConfirmDialog from 'components/ConfirmDialog';
import { TActionType } from 'utils/shared-types';
import { IUser } from 'pages/profile/data/user-types';
import { IPost, IComment } from '../data/post-types';
import { userProfileSelector } from 'pages/profile/services/store/selectors';
import { postsPhaseSelector } from '../services/store/selectors';

interface TCommentProps {
  post: IPost;
  comment: IComment;
}

const Comment = (props: TCommentProps) => {
  const { post, comment } = props;
  const intl = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [userComment, setUserComment] = React.useState(comment.content);

  const userProfile = useSelector(userProfileSelector);
  const postsPhase = useSelector(postsPhaseSelector);

  const isMe = comment.user.id === userProfile.id;

  const handleCommentUpdate = (text: string) => {
    setUserComment(text);

    // handleSaveFeed(user, { commentId: comment.id, comment: text }, 'update-comment');
  };

  const handleCommentDelete = () => {
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    // handleSaveFeed(user, { feedId: post.id, commentId: comment.id }, 'delete-comment');
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', marginBottom: 1 }}>
      <Avatar alt={comment.user.fullName} src={comment.user.avatarUrl} />
      <Box
        sx={{
          backgroundColor: 'background.default',
          borderRadius: 1,
          flexGrow: 1,
          ml: 2,
          p: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography color='textPrimary'>{`${comment.user.name} ${comment.user.family_name}`}</Typography>
          <Box flexGrow={1} />
          <Typography color='textSecondary' variant='caption'>
            {moment(comment.createdAt).fromNow()}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography component='div' variant='body2' color='textSecondary'>
              {isMe ? (
                <InlineEdit
                  text={userComment}
                  onSetText={(text: string) => handleCommentUpdate(text)}
                />
              ) : (
                comment.content
              )}
            </Typography>
          </Box>
          {isMe && (
            <Box>
              <Tooltip title={intl.translate({ id: 'app.delete' })}>
                <Fab
                  size='small'
                  color='secondary'
                  aria-label='delete'
                  onClick={handleCommentDelete}
                >
                  <DeleteIcon fontSize='small' />
                </Fab>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
        phase={postsPhase}
      />
    </Box>
  );
};

export default Comment;
