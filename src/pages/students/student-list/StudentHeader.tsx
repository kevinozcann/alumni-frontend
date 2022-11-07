import React from 'react';
import { Box, Avatar, Link, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faBook } from '@fortawesome/pro-duotone-svg-icons';
import { toAbsoluteUrl } from '../../../utils/AssetsHelpers';
import { IStudent } from 'pages/students/_store/types';

type TStudentHeaderProps = {
  studentInfo: IStudent;
};

const StudentHeader = (props: TStudentHeaderProps) => {
  const { studentInfo } = props;
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        backgroundColor: 'background.paper',
        p: 2,
        borderRadius: 1,
        marginBottom: 3
      }}
    >
      <Avatar
        src={studentInfo.photo ?? toAbsoluteUrl('/media/users/default.jpg')}
        sx={{
          height: 40,
          width: 40
        }}
      />
      <Box sx={{ ml: 2 }}>
        <Typography color='textPrimary' display='inline' variant='subtitle2'>
          {studentInfo.fullName}
        </Typography>{' '}
        <Link color='textSecondary' display='inline' variant='body2'>
          {studentInfo.email}
        </Link>
        <Typography variant='subtitle2' color='textSecondary'>
          {studentInfo.studentNumber > 0 && (
            <span style={{ marginRight: 10 }}>
              <FontAwesomeIcon size='sm' icon={faHashtag} style={{ marginRight: 2 }} />
              {studentInfo.studentNumber}
            </span>
          )}
          {studentInfo.batchNames && (
            <span>
              <FontAwesomeIcon size='sm' icon={faBook} style={{ marginRight: 2 }} />
              {studentInfo.batchNames}
            </span>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentHeader;
