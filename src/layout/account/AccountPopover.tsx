import { faInbox, faSlidersH, faUser } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import { Amplify } from 'aws-amplify';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ILayoutSettings } from 'contexts/SettingsContext';
import useSettings from 'hooks/useSettings';
import SettingsDrawer from 'layout/SettingsDrawer';
import { IUser } from 'pages/auth/data/account-types';
import { authUserSelector } from 'pages/auth/services/store/auth';

import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

const getValues = (settings: ILayoutSettings) => ({
  compact: settings.compact,
  direction: settings.direction,
  responsiveFontSizes: settings.responsiveFontSizes,
  roundedCorners: settings.roundedCorners,
  theme: settings.theme,
  mainHeightGutter: settings.mainHeightGutter
});

type TAccountPopoverProps = {
  impersonateUser: IUser;
};

const AccountPopover = (props: TAccountPopoverProps) => {
  const { impersonateUser } = props;
  const intl = useIntl();
  const navigate = useNavigate();
  const { settings, saveSettings } = useSettings();

  const [open, setOpen] = React.useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = React.useState<boolean>(false);
  const [settingsValues, setSettingsValues] = React.useState(getValues(settings));
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);

  // Selectors
  const user = useSelector(authUserSelector);

  const handleSettingsOpen = (): void => {
    setSettingsOpen(true);
    setOpen(false);
  };

  const handleSettingsClose = (): void => {
    setSettingsOpen(false);
  };

  const handleSettingsChange = (field: string, value: any): void => {
    setSettingsValues({
      ...settingsValues,
      [field]: value
    });
  };

  const handleSettingsSave = (): void => {
    saveSettings(settingsValues);
    setSettingsOpen(false);
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleClick = (url: string): void => {
    handleClose();

    navigate(url);
  };

  React.useEffect(() => {
    setSettingsValues(getValues(settings));
  }, [settings]);

  return (
    <React.Fragment>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <Avatar
          alt='user'
          src={user.avatarUrl}
          sx={{
            height: 32,
            width: 32
          }}
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        // getContentAnchorEl={null}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography color='textPrimary' variant='subtitle2'>
            {`${user?.name} ${user.family_name}`}
          </Typography>
          <Typography color='textSecondary' variant='subtitle2'>
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            p: 2
          }}
        >
          <Typography color='textPrimary' variant='body2'>
            {intl.formatMessage({ id: 'account.plan' })}{' '}
            <Button variant='text' color='primary' sx={{ paddingTop: '4px' }}>
              {intl.formatMessage({ id: 'account.plan.standard' })}
            </Button>
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 1 }}>
          <MenuItem onClick={() => handleClick('/account/home')}>
            <ListItemIcon sx={{ minWidth: 'auto', width: 12, marginRight: 2 }}>
              <FontAwesomeIcon icon={faUser} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography color='textPrimary' variant='subtitle2'>
                  {intl.formatMessage({ id: 'account.myaccount' })}
                </Typography>
              }
            />
          </MenuItem>

          <MenuItem onClick={() => handleClick('/mail/inbox')}>
            <ListItemIcon sx={{ minWidth: 'auto', width: 12, marginRight: 2 }}>
              <FontAwesomeIcon icon={faInbox} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography color='textPrimary' variant='subtitle2'>
                  {intl.formatMessage({ id: 'email.inbox' })}
                </Typography>
              }
            />
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleSettingsOpen}>
            <ListItemIcon sx={{ minWidth: 'auto', width: 12, marginRight: 2 }}>
              <FontAwesomeIcon icon={faSlidersH} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography color='textPrimary' variant='subtitle2'>
                  {intl.formatMessage({ id: 'settings.settings', defaultMessage: 'Settings' })}
                </Typography>
              }
            />
          </MenuItem>
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Button
            color='primary'
            disabled={Boolean(impersonateUser)}
            fullWidth
            onClick={() => handleClick('/logout')}
            variant='outlined'
          >
            {intl.formatMessage({ id: 'app.logout', defaultMessage: 'Logout' })}
          </Button>
        </Box>
      </Popover>

      <SettingsDrawer
        open={settingsOpen}
        values={settingsValues}
        handleClose={handleSettingsClose}
        handleChange={handleSettingsChange}
        handleSave={handleSettingsSave}
      />
    </React.Fragment>
  );
};

export default AccountPopover;
