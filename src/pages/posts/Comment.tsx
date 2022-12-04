import React from 'react';
import moment from 'moment';
import { Avatar, Box, Typography, Fab, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import useTranslation from 'hooks/useTranslation';
import InlineEdit from 'components/InlineEdit';
import ConfirmDialog from 'components/ConfirmDialog';
import { TActionType } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';

import { IPost, IPostComment } from './post-types';
import { IExtendedPost } from './_store/posts';

interface TCommentProps {
  user: IUser;
  post: IPost;
  phase: string;
  comment: IPostComment;
  handleSaveFeed: (user: IUser, post: Partial<IExtendedPost>, actionType: TActionType) => void;
}

const Comment = (props: TCommentProps) => {
  const { user, post, phase, comment, handleSaveFeed } = props;
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [userComment, setUserComment] = React.useState(comment.comment);
  const intl = useTranslation();

  const isMe = comment.owner.isMe;

  const handleCommentUpdate = (text: string) => {
    setUserComment(text);

    handleSaveFeed(user, { commentId: comment.id, comment: text }, 'update-comment');
  };

  const handleCommentDelete = () => {
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    handleSaveFeed(user, { feedId: post.id, commentId: comment.id }, 'delete-comment');
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', marginBottom: 1 }}>
      <Avatar alt='User' src={comment.owner.picture} />
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
          <Typography color='textPrimary'>{comment.owner.fullName}</Typography>
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
                comment.comment
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
        phase={phase}
      />
    </Box>
  );
};

export default Comment;
