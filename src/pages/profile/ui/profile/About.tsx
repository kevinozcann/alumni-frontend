import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faEnvelope, faWifi } from '@fortawesome/pro-duotone-svg-icons';

import { ISchool } from 'pages/organization/organization-types';
import { IUser } from 'pages/auth/data/account-types';

type TAboutProps = {
  user: IUser;
  activeSchool: ISchool;
};
const About: React.FC<TAboutProps> = (props) => {
  const { user, activeSchool } = props;

  return (
    <Box>
      <Card className='mb-6' style={{ display: 'none' }}>
        <CardHeader title={<FormattedMessage id='account.home' />} />
        <Divider />
        <CardContent>
          {/* <LinearProgress variant='determinate' value={user.profileProgress} /> */}
          <Box mt={2}>
            <Typography variant='subtitle2' color='textSecondary'>
              50% Set Up Complete
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box>
        <Card>
          <CardHeader title={<FormattedMessage id='account.myaccount' />} />
          <Divider />
          <CardContent>
            {/* <Typography variant='subtitle2' color='textSecondary'>
              {user.quote}
            </Typography> */}
            <List>
              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: 'background.secondary' }}>
                    <FontAwesomeIcon size='lg' icon={faBriefcase} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography variant='caption' color='textSecondary'>
                      {activeSchool?.title || ''}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar>
                    <FontAwesomeIcon size='lg' icon={faEnvelope} />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography variant='body2' color='textPrimary'>
                      <FormattedMessage id='email.email' />
                    </Typography>
                  }
                  secondary={
                    <Typography variant='caption' color='textSecondary'>
                      {user.email}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem disableGutters divider>
                <ListItemAvatar>
                  <Avatar>
                    <FontAwesomeIcon size='lg' icon={faWifi} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant='body2' color='textPrimary'>
                      <FormattedMessage id='account.ip_address' />
                    </Typography>
                  }
                  secondary={
                    <Typography variant='caption' color='textSecondary'>
                      {/* {userIp} */}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default About;
