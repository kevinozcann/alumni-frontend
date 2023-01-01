import { faPaperPlane } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Card, CardContent, IconButton, Input, Paper } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import AppDialog from 'components/AppDialog';
import useTranslation from 'hooks/useTranslation';

import { userProfileSelector } from 'pages/profile/services/store/selectors';
import { postsPhaseSelector } from '../services/store/selectors';
import PostForm from './PostForm';

const NewFeed = () => {
  const { action } = useParams();
  const [showDialog, setDialog] = React.useState<boolean>(action === 'share');
  const navigate = useNavigate();
  const intl = useTranslation();

  const userProfile = useSelector(userProfileSelector);
  const postsPhase = useSelector(postsPhaseSelector);

  const handleCloseDialog = () => {
    setDialog(false);

    navigate('/account/home');
  };

  const handleAddClick = () => {
    navigate('/account/home/share');

    setDialog(true);
  };

  // const handleChange = (event) => {
  //   event.persist();
  //   setValue(event.target.value);
  // };

  // const handleAttach = () => {
  //   fileInputRef.current.click();
  // };

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Box display='flex' alignItems='center'>
            <Paper
              sx={{
                flexGrow: 1,
                padding: 1
              }}
              variant='outlined'
            >
              <Input
                readOnly
                disableUnderline
                fullWidth
                onClick={handleAddClick}
                placeholder={intl.translate(
                  { id: 'post.whats_in_your_mind.name' },
                  { name: userProfile?.name }
                )}
              />
            </Paper>
            <IconButton disabled onClick={handleAddClick} size='large'>
              <FontAwesomeIcon icon={faPaperPlane} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <AppDialog
        actionType='add'
        dividers={true}
        handleClose={handleCloseDialog}
        isOpen={showDialog}
        phase={postsPhase}
        title={intl.translate({ id: 'app.share' })}
        width={450}
      >
        <PostForm actionType='add' handleClose={handleCloseDialog} />
      </AppDialog>
    </React.Fragment>
  );
};

export default NewFeed;
