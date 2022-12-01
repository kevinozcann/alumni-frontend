import React from 'react';
import { Box, IconButton, Tooltip, Typography, colors } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IUser } from '../account/account-types';
import { IPost } from './post-types';
import { TActionType } from '../../utils/shared-types';
// import ShareIcon from '@mui/icons-material/Share';

type TReactionsProps = {
  user: IUser;
  post: IPost;
  handleSaveFeed: (user: IUser, post: IPost, actionType: TActionType) => void;
};

const Reactions: React.FC<TReactionsProps> = (props) => {
  const { user, post, handleSaveFeed } = props;
  const [isLiked, setLiked] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<number>(0);
  const { likes } = post;

  const handleSave = (actionType: TActionType) => {
    handleSaveFeed(user, post, actionType);
  };

  const handleLike = () => {
    setLiked(true);
    setCount((prevLikes) => prevLikes + 1);
    handleSave('like');
  };

  const handleUnlike = () => {
    setLiked(false);
    setCount((prevLikes) => prevLikes - 1);
    handleSave('unlike');
  };

  React.useEffect(() => {
    const total = likes ? likes.length : null;
    const isMe = likes ? likes.filter((like) => like.createdBy.isMe) : null;

    setCount(total);
    setLiked(isMe?.length > 0);
    // eslint-disable-next-line
  }, [likes]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {isLiked ? (
        <Tooltip title='Unlike'>
          <IconButton sx={{ color: colors.red[600] }} onClick={handleUnlike} size='large'>
            <FavoriteIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Like'>
          <IconButton onClick={handleLike} size='large'>
            <FavoriteBorderIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )}
      <Typography color='textSecondary' variant='body2'>
        {count}
      </Typography>
      <Box flexGrow={1} />
      {/* <IconButton>
        <ShareIcon fontSize='small' />
      </IconButton> */}
    </Box>
  );
};

export default Reactions;
