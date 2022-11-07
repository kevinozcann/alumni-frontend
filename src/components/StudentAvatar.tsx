import React from 'react';
import { Avatar, CardHeader, Paper, Typography } from '@mui/material';
import { SxProps } from '@mui/system';

import getInitials from 'utils/getInitials';
import { IStudent } from 'pages/students/_store/types';

type TStudentAvatarProps = {
  student: IStudent;
  showSubTitle?: boolean;
  cardSx?: SxProps;
  cardHeaderSx?: SxProps;
  avatarSx?: SxProps;
};
const StudentAvatar = ({ student, cardSx, cardHeaderSx, avatarSx }: TStudentAvatarProps) => {
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
            alt={student?.fullName}
            src={student?.photo}
          >
            {getInitials(student?.fullName || student.name || '')}
          </Avatar>
        }
        title={
          <Typography color='textPrimary' variant='subtitle2'>
            {student?.fullName || student?.name}
          </Typography>
        }
        // subheader={(showSubTitle && student?.userTypeTitle) || ''}
        // action={
        //   <IconButton size='small' aria-label='close' onClick={handleClickClose}>
        //     <FontAwesomeIcon size='lg' icon={faTimes} />
        //   </IconButton>
        // }
      />
    </Paper>
  );
};

export default StudentAvatar;
