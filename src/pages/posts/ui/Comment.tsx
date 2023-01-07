import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Box, Fab, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ConfirmDialog from 'components/ConfirmDialog';
import InlineEdit from 'components/InlineEdit';
import useTranslation from 'hooks/useTranslation';
import { userProfileSelector } from 'pages/profile/services/store/selectors';
import { IComment, IPost } from '../data/post-types';
import { postsPhaseSelector } from '../services/store/selectors';
import { postActions } from '../services/actions';

interface TCommentProps {
  post: IPost;
  comment: IComment;
}

const Comment = (props: TCommentProps) => {
  const { post, comment } = props;
  const intl = useTranslation();
  const dispatch = useDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [userComment, setUserComment] = React.useState(comment.content);

  const userProfile = useSelector(userProfileSelector);
  const postsPhase = useSelector(postsPhaseSelector);

  const isMe = comment.user.id === userProfile.id;

  const handleCommentUpdate = (text: string) => {
    setUserComment(text);

    dispatch(postActions.updateComment(post, Object.assign({}, comment, { content: text })));
  };

  const handleCommentDelete = () => {
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(postActions.deleteComment(post, comment));
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', marginBottom: 1 }}>
      <Avatar
        alt={`${comment.user.name} ${comment.user.family_name}`}
        src={comment.user.avatarUrl}
      />
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
