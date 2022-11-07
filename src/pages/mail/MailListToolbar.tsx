import React, { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import useSnackbar from 'hooks/useSnackbar';
import useTranslation from 'hooks/useTranslation';

import { mailActions, phases } from './_store';
import { IUserMail } from './mail-types';
import ConfirmDialog from 'components/ConfirmDialog';
import { TActionType } from 'utils/shared-types';

type TMailListToolbarProps = {
  mails: IUserMail[];
  section: string;
  phase?: string;
  setSearchMails?: Dispatch<SetStateAction<IUserMail[]>>;
  onDeselectAll?: () => void;
  onSelectAll?: () => void;
  selectedMails?: number[];
};

const MailListToolbar = (props: TMailListToolbarProps) => {
  const { mails, section, phase, setSearchMails, onDeselectAll, onSelectAll, selectedMails } =
    props;
  const [search, setSearch] = React.useState<string>();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const updateSidebar = () => dispatch(mailActions.updateSidebar());
  const updateMail = (mailId: number, mailInfo: Partial<IUserMail>, actionType: TActionType) =>
    dispatch(mailActions.updateMail(mailId, mailInfo, actionType));

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target;

    if (checked && onSelectAll) {
      onSelectAll();
    }

    if (!checked && onDeselectAll) {
      onDeselectAll();
    }
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const handleMarkasRead = () => {
    selectedMails.forEach((id) => {
      updateMail(id, { isRead: true }, 'update');
    });
  };

  const handleDeleteConfirm = () => {
    selectedMails.forEach((id) => {
      updateMail(id, { isTrashed: true }, 'update');
    });
    setIsSubmitted(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  const selectedAllMails = selectedMails?.length === mails?.length && mails?.length > 0;
  const selectedSomeMails = selectedMails?.length > 0 && selectedMails?.length < mails?.length;

  React.useEffect(() => {
    if (search) {
      setSearchMails(
        mails.filter(
          (m) =>
            m.email.msgBody.toLowerCase().includes(search.toLowerCase()) ||
            m.email.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.email.user?.fullName.toLowerCase().includes(search.toLowerCase()) ||
            m.email.sender.fullName.toLowerCase().includes(search.toLowerCase()) ||
            m.email.emailToUser.fullName.toLowerCase().includes(search.toLowerCase()) ||
            m.user?.fullName.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setSearchMails(mails);
    }
  }, [search]);

  React.useEffect(() => {
    if (isSubmitted && phase === phases.MAIL_UPDATING_SUCCESSFUL) {
      setShowConfirmDialog(false);

      showSnackbar({
        message: intl.formatMessage({ id: 'email.deleted' }),
        open: true
      });
    }
  }, [phase]);

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        display: 'flex',
        height: '68px',
        p: 2
      }}
    >
      <IconButton
        sx={{ display: { xs: 'block', md: 'none' } }}
        onClick={updateSidebar}
        size='large'
      >
        <ChevronRightIcon fontSize='small' />
      </IconButton>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Checkbox
            checked={selectedAllMails}
            color='primary'
            indeterminate={selectedSomeMails}
            onChange={handleCheckboxChange}
          />
          <Typography color='textPrimary' variant='subtitle2'>
            {intl.translate({ id: 'app.select_all' })}
          </Typography>
        </Box>

        {selectedMails?.length > 0 && section !== 'trash' && (
          <Box sx={{ py: 1 }}>
            <Tooltip title={intl.formatMessage({ id: 'app.delete' })}>
              <IconButton onClick={handleDelete} size='large'>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {selectedMails?.length > 0 && (
          <Box sx={{ py: 1 }}>
            <Tooltip title={intl.formatMessage({ id: 'mark_as_read' })}>
              <IconButton onClick={handleMarkasRead} size='large'>
                <DoneAllIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ width: 200 }}>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              )
            }}
            placeholder={intl.translate({ id: 'email.search' })}
            size='small'
            variant='outlined'
            onChange={(event) => setSearch(event.target.value)}
          />
        </Box>
        {/* <Tooltip title='More options'>
          <IconButton>
            <DotsHorizontalIcon fontSize='small' />
          </IconButton>
        </Tooltip> */}
        {mails?.length > 0 && (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Tooltip title={intl.translate({ id: 'app.previous' })}>
              <IconButton size='large'>
                <ChevronLeftIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <React.Fragment>
              <Typography color='textSecondary' noWrap variant='body2'>
                {/* 1 - {mails} of {mails} */}
                {mails?.length}
              </Typography>
              <Tooltip title={intl.translate({ id: 'app.next' })}>
                <IconButton size='large'>
                  <ChevronRightIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          </Box>
        )}
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

export default MailListToolbar;
