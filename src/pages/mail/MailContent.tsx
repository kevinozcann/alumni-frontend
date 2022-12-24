import React from 'react';
import loadable from '@loadable/component';
import { useIntl } from 'react-intl';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Avatar, Box, Button, Divider, IconButton, Link, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AttachFile, Delete, OpenInNew, Shortcut } from '@mui/icons-material';

import { authUserSelector } from 'pages/auth/services/store/auth';
import { AppDispatch, RootState } from 'store/store';
import { TActionType } from 'utils/shared-types';
import getInitials from 'utils/getInitials';
import useSettings from 'hooks/useSettings';
import useSnackbar from 'hooks/useSnackbar';

import { mailActions, phases } from './_store';
import { composeSelector, mailsPhaseSelector } from './_store/selectors';
import { IMail, IUserMail } from './mail-types';

const Moment = loadable.lib(() => import('moment'));
const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));
const MailToolbar = loadable(() => import('./MailToolbar'));
const MailReply = loadable(() => import('./MailReply'));

const MarkdownWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.body1.fontFamily,
  '& > *': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginBottom: theme.spacing(2)
  }
}));

const mapStateToProps = (state: RootState) => ({
  phase: mailsPhaseSelector(state),
  user: authUserSelector(state),
  isComposeOpen: composeSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateMail: (mailId: number, mailInfo: Partial<IUserMail>, actionType: TActionType) =>
    dispatch(mailActions.updateMail(mailId, mailInfo, actionType)),
  updateDraft: (email: IMail) => dispatch(mailActions.updateDraft(email)),
  updateCompose: () => dispatch(mailActions.updateCompose())
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type MailContentProps = PropsFromRedux & {
  mail: IUserMail;
  section: string;
  label: string;
  handleStarClick: (mailId: number, starred: boolean) => void;
  handleDeleteClick?: (mailId: number) => void;
};

const MailContent: React.FC<MailContentProps> = (props) => {
  const {
    mail: currentMail,
    // handleStarClick,
    // handleDeleteClick,
    label,
    phase,
    // pullMails,
    updateMail,
    section,
    user,
    updateDraft,
    updateCompose,
    isComposeOpen
  } = props;
  const intl = useIntl();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { showSnackbar } = useSnackbar();
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState<boolean>(false);

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    updateMail(currentMail?.id, { isTrashed: true }, 'update');
    setIsSubmitted(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  const draftValues: IMail = {
    subject: currentMail?.email?.subject,
    msgBody: currentMail?.email?.msgBody
  };

  const handleForward = () => {
    console.log(draftValues);
    if (!isComposeOpen) updateCompose();
    updateDraft(draftValues);
  };

  const randomizeFileTitle = (fileName) => {
    const splitName = fileName.split('_');
    const newStr = fileName.replace(splitName[0] + '_' + splitName[1] + '_', '');
    return newStr.toLowerCase();
  };

  const handleAttachmentClick = (itemUrl) => {
    window.open(itemUrl, '_blank');
  };

  const mailAttachments =
    (currentMail?.email?.attachment && `${currentMail?.email?.attachment}`.split(',')) || null;

  React.useEffect(() => {
    if (currentMail && !currentMail?.isRead) {
      updateMail(currentMail?.id, { isRead: true }, 'update');
    }
    // eslint-disable-next-line
  }, [currentMail, updateMail]);

  React.useEffect(() => {
    if (isSubmitted && phase === phases.MAIL_UPDATING_SUCCESSFUL) {
      setShowConfirmDialog(false);

      showSnackbar({
        message: intl.formatMessage({ id: 'email.deleted' }),
        open: true
      });

      setTimeout(() => {
        navigate('/mail/inbox');
      }, 500);
    }
  }, [phase]);

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${settings.mainHeightGutter}px)`,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'auto'
      }}
    >
      <MailToolbar section={section} label={label} />

      <Divider />

      <Box
        sx={{
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'space-between',
          p: 3
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          {section == 'sent' ? (
            <Avatar
              src={currentMail?.email?.emailToUser?.avatarUrl}
              sx={{
                height: 48,
                width: 48
              }}
            >
              {getInitials(currentMail?.email?.emailToUser?.fullName)}
            </Avatar>
          ) : (
            <Avatar
              src={currentMail?.email?.sender?.avatarUrl}
              sx={{
                height: 48,
                width: 48
              }}
            >
              {getInitials(currentMail?.email?.sender?.fullName)}
            </Avatar>
          )}

          <Box sx={{ ml: 2 }}>
            <Typography color='textPrimary' display='inline' variant='subtitle2'>
              {section == 'sent'
                ? currentMail?.email?.emailToUser?.fullName
                : currentMail?.email?.sender?.fullName}
            </Typography>{' '}
            <Link color='textSecondary' display='inline' variant='body2'>
              {section == 'sent'
                ? currentMail?.email?.emailToUser?.email
                : currentMail?.email?.sender?.email}
            </Link>
            <Typography variant='subtitle2' color='textSecondary'>
              {currentMail?.isTo && (
                <span>
                  {'To: '}
                  <Link color='inherit' key={currentMail?.user?.email}>
                    {currentMail?.user?.email}
                  </Link>
                </span>
              )}
            </Typography>
            <Typography variant='subtitle2' color='textSecondary'>
              {currentMail?.isCc && (
                <span>
                  {'Cc: '}
                  <Link color='inherit' key={currentMail?.user?.email}>
                    {currentMail?.user?.email}
                  </Link>
                </span>
              )}
            </Typography>
            <Typography variant='subtitle2' color='textSecondary'>
              {currentMail?.isBcc && (
                <span>
                  {'Bcc: '}
                  {currentMail?.user?.email}
                  <Link color='inherit' key={currentMail?.user?.email}></Link>
                </span>
              )}
            </Typography>
            <Typography color='textSecondary' noWrap variant='caption'>
              <Moment>
                {({ default: moment }) => moment(currentMail?.email?.sentAt).format('LLLL')}
              </Moment>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {/* <Tooltip title='Reply'>
              <IconButton>
                <ReplyIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Reply all'>
              <IconButton>
                <ReplyAllIcon fontSize='small' />
              </IconButton>
            </Tooltip> */}
            <Tooltip title={intl.formatMessage({ id: 'app.delete' })}>
              <IconButton onClick={handleDelete} size='large'>
                <Delete fontSize='small' />
              </IconButton>
            </Tooltip>

            <Tooltip title={intl.formatMessage({ id: 'forward' })}>
              <IconButton onClick={handleForward} size='large'>
                <Shortcut fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
          {/* <Tooltip title='More options'>
            <IconButton>
              <MoreIcon fontSize='small' />
            </IconButton>
          </Tooltip> */}
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          p: 3,
          pb: 6
        }}
      >
        <Typography variant='h1' color='textPrimary'>
          {currentMail?.email?.subject}
        </Typography>
        <Box
          sx={{
            mt: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <MarkdownWrapper>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {currentMail?.email?.msgBody || ''}
            </ReactMarkdown>
          </MarkdownWrapper>

          {mailAttachments && (
            <Box>
              <Divider />
              {mailAttachments.map((attachment) => (
                <Button
                  key={attachment}
                  onClick={() => handleAttachmentClick(attachment)}
                  startIcon={<AttachFile fontSize='small' />}
                  endIcon={<OpenInNew fontSize='small' />}
                  variant='text'
                >
                  {randomizeFileTitle(attachment)}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      <Divider />

      <MailReply mail={currentMail} user={user} />

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleDeleteConfirm}
        isOpen={showConfirmDialog}
        phase={phase}
      />
    </Box>
  );
};

export default connector(MailContent);
