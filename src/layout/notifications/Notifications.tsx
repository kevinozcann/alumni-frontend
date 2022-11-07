import React from 'react';
import { Box, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

import UserAvatar from 'components/UserAvatar';
import { ShortDate } from 'utils/Helpers';
import { IUserMail } from 'pages/mail/mail-types';

import AllCaughtUp from './AllCaughtUp';

type TNotificationsProps = {
  notifications: IUserMail[];
};

const Notifications: React.FC<TNotificationsProps> = ({ notifications }) => {
  return (
    <Box>
      {(notifications && notifications.length === 0 && <AllCaughtUp message='NO_RECORD' />) || (
        <List component='nav' disablePadding>
          {notifications?.map((notification) => {
            return (
              <Link
                key={notification.id}
                href={`/mail/inbox/${notification.id}`}
                sx={{
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
                <ListItem divider>
                  <ListItemAvatar>
                    <UserAvatar
                      cardSx={{ boxShadow: 'none' }}
                      cardHeaderSx={{ p: 0 }}
                      avatarSx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                      }}
                      user={notification.email.sender}
                      showTitle={false}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        color='textPrimary'
                        sx={{ cursor: 'pointer' }}
                        variant='subtitle2'
                      >
                        {notification.email?.subject || ''}
                      </Typography>
                    }
                    secondary={<ShortDate date={notification.email?.sentAt} />}
                  />
                </ListItem>
              </Link>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default Notifications;
