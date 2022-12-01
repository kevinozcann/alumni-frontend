import React from 'react';
import { Avatar, IconButton, Input, Paper, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/pro-duotone-svg-icons';

import useKeyPress from 'hooks/useKeypress';
import useTranslation from 'hooks/useTranslation';
import { TActionType } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';

import { IExtendedPost } from './_store/posts';
import { IPost } from './post-types';

type TCommentAddProps = {
  user: IUser;
  post: IPost;
  handleSaveFeed: (user: IUser, post: Partial<IExtendedPost>, actionType: TActionType) => void;
};

const CommentAdd = (props: TCommentAddProps) => {
  const { user, post, handleSaveFeed } = props;
  const [value, setValue] = React.useState<string>('');
  const enter = useKeyPress('Enter');
  const intl = useTranslation();

  const handleChange = (event: any) => {
    event.persist();
    setValue(event.target.value);
  };

  const handleSave = () => {
    handleSaveFeed(user, { feedId: post.id, comment: value }, 'add-comment');
  };

  // const handleAttach = () => {
  //   fileInputRef.current.click();
  // };

  React.useEffect(() => {
    if (value && enter) {
      setValue('');
      handleSave();
    }
  }, [value, enter]);

  return (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>
      <Avatar alt='User' src={user.picture} />

      <Paper sx={{ flexGrow: 1, ml: 2, p: 0.5 }} variant='outlined'>
        <Input
          sx={{ pl: 1 }}
          disableUnderline
          fullWidth
          value={value}
          onChange={handleChange}
          placeholder={intl.translate({ id: 'email.leave_a_message' })}
        />
      </Paper>

      <IconButton
        disabled={value.length === 0}
        color={value.length > 0 ? 'primary' : 'inherit'}
        onClick={handleSave}
        size='large'
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </IconButton>

      {/* <Divider className={classes.divider} />
      <Tooltip title='Attach image'>
        <IconButton edge='end' onClick={handleAttach}>
          <AddPhotoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Attach file'>
        <IconButton edge='end' onClick={handleAttach}>
          <AttachFileIcon />
        </IconButton>
      </Tooltip>
      <input className={classes.fileInput} ref={fileInputRef} type='file' /> */}
    </Box>
  );
};

export default CommentAdd;
