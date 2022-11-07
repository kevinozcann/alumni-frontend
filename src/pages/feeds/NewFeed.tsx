import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { Box, Card, CardContent, IconButton, Input, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/pro-duotone-svg-icons';

import { authUserSelector } from 'store/auth';
import { RootState } from 'store/store';
import useTranslation from 'hooks/useTranslation';
import SchoostDialog from 'components/SchoostDialog';

import { feedsPhaseSelector } from './_store/feeds';
import AddFeedForm from './NewFeedForm';

const mapStateToProps = (state: RootState) => ({
  feedsPhase: feedsPhaseSelector(state),
  user: authUserSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TNewFeedProps = PropsFromRedux & {
  handleClose: () => void;
};

const NewFeed = (props: TNewFeedProps) => {
  const { feedsPhase, handleClose, user } = props;
  const { action } = useParams();
  const [showDialog, setDialog] = React.useState<boolean>(action === 'share');
  const navigate = useNavigate();
  const intl = useTranslation();

  const handleCloseDialog = () => {
    setDialog(false);

    handleClose();
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
                  { id: 'feed.whats_in_your_mind.name' },
                  { name: user.name }
                )}
              />
            </Paper>
            <IconButton disabled onClick={handleAddClick} size='large'>
              <FontAwesomeIcon icon={faPaperPlane} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <SchoostDialog
        actionType='add'
        dividers={true}
        handleClose={handleCloseDialog}
        isOpen={showDialog}
        phase={feedsPhase}
        title={intl.translate({ id: 'app.share' })}
        width={450}
      >
        <AddFeedForm actionType='add' handleClose={handleCloseDialog} />
      </SchoostDialog>
    </React.Fragment>
  );
};

export default connector(NewFeed);
