import React from 'react';
import loadable from '@loadable/component';
import { useIntl } from 'react-intl';
import { connect, ConnectedProps } from 'react-redux';
import { Badge, Box, Divider, IconButton, Popover, Tab, Tabs, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-duotone-svg-icons';

import { AppDispatch, RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { recentUpdatesActions, recentUpdatesSelector } from 'store/recentUpdates';
import { notificationsSelector } from 'pages/mail/_store/selectors';

import Scrollbar from '../Scrollbar';

const Notifications = loadable(() => import('./Notifications'));
const Updates = loadable(() => import('./Updates'));
const News = loadable(() => import('./News'));

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  notifications: notificationsSelector(state),
  recentUpdates: recentUpdatesSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  pullRecentUpdates: () => dispatch(recentUpdatesActions.pullRecentUpdates())
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TNotificationsPopoverProps = PropsFromRedux;

const NotificationsPopover = (props: TNotificationsPopoverProps) => {
  const { lang, notifications, recentUpdates, pullRecentUpdates } = props;
  const intl = useIntl();
  const [open, setOpen] = React.useState<boolean>(false);
  const [currentTab, setCurrentTab] = React.useState<string>('notifications');
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const { updates, phase: updatesPhase } = recentUpdates;

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleTabsChange = (event: React.ChangeEvent<any>, value: string): void => {
    setCurrentTab(value);
  };

  React.useEffect(() => {
    if (currentTab === 'updates') {
      pullRecentUpdates();
    }
  }, [currentTab]);

  return (
    <React.Fragment>
      <IconButton color='inherit' ref={anchorRef} onClick={handleOpen} size='large'>
        <Badge color='error' badgeContent={(notifications && notifications.length) || null}>
          <FontAwesomeIcon icon={faBell} />
        </Badge>
      </IconButton>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 320, overflow: 'hidden' }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography color='textPrimary' variant='h6'>
            {intl.formatMessage({ id: 'notifications.notifications' })}
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Tabs
            indicatorColor='primary'
            onChange={handleTabsChange}
            textColor='primary'
            value={currentTab}
            variant='standard'
          >
            <Tab
              sx={{ minWidth: 'auto !important', textTransform: 'none' }}
              label={intl.formatMessage({ id: 'notifications.notifications' })}
              value='notifications'
            />
            <Tab
              sx={{ minWidth: 'auto !important', textTransform: 'none', whiteSpace: 'nowrap' }}
              label={intl.formatMessage({ id: 'notifications.recent_updates' })}
              value='updates'
            />
            <Tab
              sx={{ minWidth: 'auto !important', textTransform: 'none' }}
              label={intl.formatMessage({ id: 'notifications.news' })}
              value='news'
            />
          </Tabs>
        </Box>
        <Divider />
        <Box
          sx={{
            m: 1,
            backgroundColor: 'background.paper',
            height: 260
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative'
            }}
          >
            <Scrollbar options={{ suppressScrollX: true, wheelSpeed: 2, wheelPropagation: false }}>
              {currentTab === 'notifications' && <Notifications notifications={notifications} />}
              {currentTab === 'updates' && (
                <Updates lang={lang} updates={updates} updatesPhase={updatesPhase} />
              )}
              {currentTab === 'news' && <News news={null} newsPhase='' />}
            </Scrollbar>
          </Box>
        </Box>
      </Popover>
    </React.Fragment>
  );
};

export default connector(NotificationsPopover);
