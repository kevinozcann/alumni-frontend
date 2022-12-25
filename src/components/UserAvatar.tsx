import { Avatar, CardHeader, Paper } from '@mui/material';
import { SxProps } from '@mui/system';

import { IUser } from 'pages/profile/data/user-types';
import getInitials from 'utils/getInitials';

type TUserAvatarProps = {
  user: Partial<IUser>;
  showTitle?: boolean;
  showSubTitle?: boolean;
  cardSx?: SxProps;
  cardHeaderSx?: SxProps;
  avatarSx?: SxProps;
};
const UserAvatar = ({
  user,
  showTitle,
  showSubTitle,
  cardSx,
  cardHeaderSx,
  avatarSx
}: TUserAvatarProps) => {
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
            alt={user?.name}
            src={user?.avatarUrl}
          >
            {getInitials(user?.name + '' + user?.family_name || '')}
          </Avatar>
        }
        title={(showTitle && (`${user?.name} ${user?.family_name}` || '')) || ''}
        // subheader={(showSubTitle && user?.userTypeTitle) || ''}
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
