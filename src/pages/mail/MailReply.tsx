import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';
import { useIntl } from 'react-intl';
import { Avatar, Box, Button, CircularProgress, Paper, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/pro-duotone-svg-icons';

import { AppDispatch, RootState } from 'store/store';
import useSnackbar from 'hooks/useSnackbar';
import { IUser } from 'pages/auth/data/account-types';

import { mailActions, phases } from './_store';
import { mailsPhaseSelector } from './_store/selectors';
import { IMail, IUserMail } from './mail-types';

const MailReplyTextarea = styled(TextareaAutosize)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: 'none',
  color: theme.palette.text.primary,
  fontFamily: theme.typography.body1.fontFamily,
  fontSize: theme.typography.body1.fontSize,
  lineHeight: theme.typography.body1.lineHeight,
  outline: 'none',
  resize: 'none',
  width: '100%',
  '&::placeholder': {
    color: theme.palette.text.secondary
  }
}));

const mapStateToProps = (state: RootState) => ({
  mailsPhase: mailsPhaseSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  sendMail: (email: IMail) => dispatch(mailActions.sendMail(email, true))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type MailReplyProps = PropsFromRedux & {
  user: IUser;
  mail: IUserMail;
};

const MailReply: React.FC<MailReplyProps> = ({ mail, user, mailsPhase, sendMail }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [msgBody, setMsgBody] = React.useState<string>('');
  const intl = useIntl();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    event.persist();
    setMsgBody(event.target.value);
  };

  // const handleAttach = (): void => {
  //   fileInputRef.current.click();
  // };

  const handleSendMail = () => {
    sendMail({
      subject: mail.email.subject,
      attachment: '',
      msgBody: msgBody,
      sender: user,
      to: [mail.email.sender],
      cc: [],
      bcc: []
    });
  };

  // Show feedback once email is sent
  React.useEffect(() => {
    if (mailsPhase === phases.MAIL_SENDING_SUCCESSFUL) {
      setMsgBody('');

      showSnackbar({
        message: intl.formatMessage({ id: 'email.sent_successfully' }),
        open: true
      });

      navigate('/mail/inbox');
    }
    // eslint-disable-next-line
  }, [mailsPhase, msgBody, showSnackbar]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: 3
      }}
    >
      <Avatar src={user.avatarUrl} />
      <Paper
        sx={{
          flexGrow: 1,
          ml: 2,
          p: 2
        }}
        variant='outlined'
      >
        <MailReplyTextarea
          minRows={3}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: 'email.leave_a_message' })}
          value={msgBody}
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2
          }}
        >
          <Button
            sx={{ mr: 1 }}
            disabled={msgBody === '' || mailsPhase?.endsWith('ing')}
            color='primary'
            variant='contained'
            startIcon={
              mailsPhase?.endsWith('ing') ? (
                <CircularProgress size={20} />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} />
              )
            }
            onClick={handleSendMail}
          >
            {intl.formatMessage({ id: 'app.send' })}
          </Button>
          {/* <Tooltip title='Attach image'>
            <IconButton onClick={handleAttach} size='small' sx={{ mr: 1 }}>
              <AddPhotoIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Attach file'>
            <IconButton onClick={handleAttach} size='small' sx={{ mr: 1 }}>
              <AttachFileIcon fontSize='small' />
            </IconButton>
          </Tooltip> */}
        </Box>
      </Paper>
      <input hidden ref={fileInputRef} type='file' />
    </Box>
  );
};

export default connector(MailReply);
