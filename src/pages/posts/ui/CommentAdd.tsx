import { faPaperPlane } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Box, IconButton, Input, Paper } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useKeyPress from 'hooks/useKeypress';
import useTranslation from 'hooks/useTranslation';
import { authUserSelector } from 'pages/auth/services/auth';

import { IPost } from '../data/post-types';
import { postActions } from '../services/actions';

type TCommentAddProps = {
  post: IPost;
};

const CommentAdd = (props: TCommentAddProps) => {
  const { post } = props;
  const [value, setValue] = React.useState<string>('');
  const enter = useKeyPress('Enter');
  const intl = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(authUserSelector);

  const handleChange = (event: any) => {
    event.persist();
    setValue(event.target.value);
  };

  const handleSave = () => {
    dispatch(postActions.addComment(user.attributes, post, { content: value }));
  };

  React.useEffect(() => {
    if (value && enter) {
      setValue('');
      handleSave();
    }
  }, [value, enter]);

  return (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>
      <Avatar alt='User' src={user.attributes.avatarUrl} />

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
