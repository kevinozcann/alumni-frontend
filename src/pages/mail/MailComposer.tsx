// @ts-nocheck
import React from 'react';
import loadable from '@loadable/component';
import { connect, ConnectedProps } from 'react-redux';
import { useFormik } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
// import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';

import { AppDispatch, RootState } from 'store/store';
import { authUserSelector } from 'store/auth';
import { searchActions, searchUsersSelector } from 'store/search';
import useSnackbar from 'hooks/useSnackbar';
import { useTranslation } from 'hooks/useTranslation';
import { i18nLangSelector } from 'store/i18n';
import { TLang } from 'utils/shared-types';
import { SaveButton } from 'utils/ActionLinks';
import { IUser } from 'pages/account/account-types';

import { mailActions, phases } from './_store';
import { composeSelector, draftSelector, mailsPhaseSelector } from './_store/selectors';
import { IMail } from './mail-types';

const QuillEditor = loadable(() => import('components/QuillEditor'));
const UserAvatar = loadable(() => import('components/UserAvatar'));
const ConfirmDialog = loadable(() => import('components/ConfirmDialog'));

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  userResults: searchUsersSelector(state),
  draft: draftSelector(state),
  phase: mailsPhaseSelector(state),
  isComposeOpen: composeSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  sendMail: (email: IMail) => dispatch(mailActions.sendMail(email, false)),
  updateDraft: (email: IMail) => dispatch(mailActions.updateDraft(email)),
  updateCompose: () => dispatch(mailActions.updateCompose()),
  searchUsers: (lang: TLang, userId: string, searchKey: string) =>
    dispatch(searchActions.searchUsers(lang, userId, searchKey))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TMailComposerProps = PropsFromRedux;

const MailComposer: React.FC<TMailComposerProps> = (props) => {
  const {
    lang,
    user,
    userResults,
    draft,
    phase,
    isComposeOpen,
    sendMail,
    updateDraft,
    updateCompose,
    searchUsers
  } = props;
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [toInputValue, setToInputValue] = React.useState<string>('');
  // const [ccInputValue, setCcInputValue] = React.useState<string>('');
  // const [bccInputValue, setBccInputValue] = React.useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = React.useState<boolean>(false);
  const intl = useTranslation();
  const { showSnackbar } = useSnackbar();

  const formValues: IMail = {
    subject: draft?.subject || '',
    msgBody: draft?.msgBody || '',
    attachment: draft?.attachment || '',
    sender: user,
    to: draft?.to || [],
    cc: draft?.cc || [],
    bcc: draft?.bcc || []
  };

  const { handleSubmit, handleChange, setFieldValue, values, initialValues, errors, isSubmitting } =
    useFormik({
      initialValues: formValues,
      validate: (values: IMail) => validateForm(values),
      onSubmit: () => handleSendConfirm()
    });

  const validateForm = (values: IMail) => {
    if (!isSubmitting) {
      return;
    }
    const errors = {};
    const nonEmptyFields = ['to', 'subject', 'msgBody'];

    nonEmptyFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = intl.formatMessage({ id: 'app.cannot_be_empty' });
      }
    });

    return errors;
  };

  const handleExitFullScreen = (): void => {
    setIsFullScreen(false);
  };

  const handleEnterFullScreen = (): void => {
    setIsFullScreen(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirmDialog(false);
  };

  const handleSendConfirm = () => {
    setShowConfirmDialog(true);
  };

  const handleSendMail = () => {
    sendMail({
      subject: values.subject,
      // attachment: '',
      msgBody: values.msgBody,
      sender: user,
      to: values.to,
      cc: values.cc,
      bcc: values.bcc
    });
  };

  React.useEffect(() => {
    if (!toInputValue || toInputValue.length < 3) {
      return;
    }
    searchUsers(lang, user.uuid, toInputValue);
  }, [toInputValue]);

  // Update draft once values changed
  React.useEffect(() => {
    if (initialValues !== values) {
      updateDraft(values);
    }
  }, [values]);

  React.useEffect(() => {
    setFieldValue('subject', draft?.subject ? draft?.subject : values.subject);
    setFieldValue('msgBody', draft?.msgBody ? draft?.msgBody : values.msgBody);
  }, [draft]);

  // Show feedback once email is sent
  React.useEffect(() => {
    if (phase === phases.MAIL_SENDING_SUCCESSFUL) {
      setShowConfirmDialog(false);

      showSnackbar({
        message: intl.formatMessage({ id: 'email.sent_successfully' }),
        open: true
      });
    }
  }, [phase]);

  if (!isComposeOpen) {
    return null;
  }

  return (
    <Portal>
      <Backdrop open={isFullScreen} />
      <Paper
        sx={{
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          margin: 3,
          maxHeight: (theme) => `calc(100% - ${theme.spacing(6)})`,
          maxWidth: (theme) => `calc(100% - ${theme.spacing(6)})`,
          minHeight: 500,
          outline: 'none',
          position: 'fixed',
          right: 0,
          width: 600,
          zIndex: 1300,
          ...(isFullScreen && {
            height: '100%',
            width: '100%'
          })
        }}
        elevation={12}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            px: 2,
            py: 1
          }}
        >
          <Typography variant='h6' color='textPrimary'>
            {intl.formatMessage({ id: 'email.compose' })}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isFullScreen ? (
            <IconButton onClick={handleExitFullScreen} size='large'>
              <MinimizeIcon fontSize='small' />
            </IconButton>
          ) : (
            <IconButton onClick={handleEnterFullScreen} size='large'>
              <FullscreenIcon fontSize='small' />
            </IconButton>
          )}
          <IconButton onClick={updateCompose} size='large'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>

        <form
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          className='form'
          noValidate={true}
          autoComplete='off'
          onSubmit={handleSubmit}
        >
          <Autocomplete
            id='to'
            multiple
            autoComplete
            limitTags={3}
            noOptionsText={intl.formatMessage({ id: 'email.search_for_user' })}
            onChange={(_event, newValue) => {
              if (typeof newValue === 'string') {
                return;
              } else if (newValue) {
                setFieldValue('to', newValue);
              }
            }}
            options={userResults}
            defaultValue={values.to}
            getOptionLabel={(option: Partial<IUser>) => {
              if (typeof option === 'string') {
                return option;
              }
              return option?.fullName;
            }}
            filterOptions={(x) => x}
            onInputChange={(_event, newToInputValue) => {
              setToInputValue(newToInputValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={index}
                  avatar={<Avatar alt={option?.fullName} src={option?.picture} />}
                  variant='outlined'
                  label={option?.fullName}
                  size='small'
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiInput-root:before': {
                    content: 'none'
                  }
                }}
                placeholder={intl.formatMessage({ id: 'email.to' })}
                fullWidth
                variant='standard'
                margin='dense'
              />
            )}
            renderOption={(props, option) => {
              return (
                <li key={option.uuid} {...props}>
                  <UserAvatar
                    user={option}
                    showTitle
                    cardSx={{
                      borderRadius: '0px',
                      boxShadow: 'none',
                      backgroundColor: 'transparent'
                    }}
                    cardHeaderSx={{ p: 1 }}
                    avatarSx={{ width: '20px', height: '20px' }}
                  />
                </li>
              );
            }}
          />
          <TextField
            sx={{
              px: 2,
              py: 1,
              borderBottom: 1,
              borderColor: 'divider'
            }}
            id='subject'
            placeholder={intl.formatMessage({ id: 'email.subject' })}
            fullWidth
            variant='standard'
            size='small'
            margin='dense'
            InputProps={{ disableUnderline: true }}
            value={values.subject}
            onChange={handleChange}
            error={!!errors.subject}
            helperText={errors?.subject}
          />
          <QuillEditor
            placeholder={intl.formatMessage({ id: 'email.leave_a_message' })}
            sx={{
              border: 'none',
              flexGrow: 1
            }}
            id='msgBody'
            value={values.msgBody}
            onChange={(e: any) => setFieldValue('msgBody', e)}
          />

          <Divider />

          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          >
            {/* <Tooltip title='Attach image'>
              <IconButton size='small' sx={{ ml: 1 }}>
                <AddPhotoIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Attach file'>
              <IconButton size='small' sx={{ ml: 1 }}>
                <AttachFileIcon fontSize='small' />
              </IconButton>
            </Tooltip> */}
            <SaveButton text='app.send' sx={{ marginLeft: 'auto' }} aria-label='save' />
          </Box>
        </form>
      </Paper>

      <ConfirmDialog
        handleClose={handleCloseConfirm}
        handleConfirm={handleSendMail}
        isOpen={showConfirmDialog}
        title={intl.formatMessage({ id: 'app.send' })}
        intro={intl.formatMessage({ id: 'email.sure_to_send' })}
        confirmBtnText={intl.formatMessage({ id: 'app.send' })}
        phase={phase}
      />
    </Portal>
  );
};

export default connector(MailComposer);
