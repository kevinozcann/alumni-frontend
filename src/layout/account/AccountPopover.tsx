import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faSlidersH, faUser, faUserSecret } from '@fortawesome/pro-duotone-svg-icons';

import useAuth from 'hooks/useAuth';
import useSettings from 'hooks/useSettings';
import { ILayoutSettings } from 'contexts/SettingsContext';
import SettingsDrawer from 'layout/SettingsDrawer';
import { IUser } from 'pages/account/account-types';

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

const AccountPopover: React.FC<TAccountPopoverProps> = (props) => {
  const { impersonateUser } = props;
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const intl = useIntl();
  const { user } = useAuth();
  const [open, setOpen] = React.useState<boolean>(false);
  const { settings, saveSettings } = useSettings();
  const [settingsOpen, setSettingsOpen] = React.useState<boolean>(false);
  const [settingsValues, setSettingsValues] = React.useState(getValues(settings));

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
          src={user?.picture}
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
            {user?.fullName}
          </Typography>
          <Typography color='textSecondary' variant='subtitle2'>
            {user?.email}
          </Typography>
          <Typography color='textSecondary' variant='subtitle2'>
            {user?.userType?.title}
            {/*<FormattedMessage id={user?.userType?.title} />*/}
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

          {/* 1 is admin and 18 is IT manager */}
          {[1, 18].includes(user?.userType.id) && !impersonateUser && (
            <React.Fragment>
              <Divider />

              <MenuItem onClick={() => handleClick('/account/impersonate')}>
                <ListItemIcon sx={{ minWidth: 'auto', width: 12, marginRight: 2 }}>
                  <FontAwesomeIcon icon={faUserSecret} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography color='textPrimary' variant='subtitle2'>
                      {intl.formatMessage({ id: 'account.impersonate' })}
                    </Typography>
                  }
                />
              </MenuItem>
            </React.Fragment>
          )}

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
