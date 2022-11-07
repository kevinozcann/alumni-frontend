import React from 'react';
import { Avatar, CardHeader, Paper } from '@mui/material';
import { SxProps } from '@mui/system';

import getInitials from 'utils/getInitials';
import { IUser } from 'pages/account/account-types';

type TUserAvatarProps = {
  user: Partial<IUser>;
  showTitle?: boolean;
  showSubTitle?: boolean;
  cardSx?: SxProps;
  cardHeaderSx?: SxProps;
  avatarSx?: SxProps;
};
const UserAvatar: React.FC<TUserAvatarProps> = ({
  user,
  showTitle,
  showSubTitle,
  cardSx,
  cardHeaderSx,
  avatarSx
}) => {
  return (
    <Paper
      sx={
        cardSx || {
          borderRadius: '0px',
          boxShadow: 'none',
          backgroundColor: 'transparent'
        }
      }
    >
      <CardHeader
        sx={cardHeaderSx || { p: 1 }}
        avatar={
          <Avatar
            sx={avatarSx || { width: '30px', height: '30px' }}
            alt={user?.fullName}
            src={user?.picture}
          >
            {getInitials(user?.fullName || '')}
          </Avatar>
        }
        title={(showTitle && (user?.fullName || user?.name)) || ''}
        subheader={(showSubTitle && user?.userTypeTitle) || ''}
        // action={
        //   <IconButton size='small' aria-label='close' onClick={handleClickClose}>
        //     <FontAwesomeIcon size='lg' icon={faTimes} />
        //   </IconButton>
        // }
      />
    </Paper>
  );
};

export default UserAvatar;
