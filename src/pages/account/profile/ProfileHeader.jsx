import React, { Fragment } from 'react';
import { Avatar, Button, Card, CardHeader, CardMedia, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { toAbsoluteUrl } from '../../../utils/AssetsHelpers';
import { faHome } from '@fortawesome/pro-duotone-svg-icons';

const useStyles = makeStyles({
  headerAction: {
    marginTop: 0
  }
});

export const ProfileHeader = ({ user }) => {
  const styles = useStyles();
  const wallpaper = user.wallpaper ?? toAbsoluteUrl('/media/users/cover.jpg');
  const profileImg = user.picture ?? toAbsoluteUrl('/media/users/default.jpg');

  return (
    <Fragment>
      <Card>
        <CardMedia component='img' image={wallpaper} title='user wallpaper' />
        <CardHeader
          avatar={<Avatar alt='username' src={profileImg} />}
          title={`${user.name} ${user.lastName}`}
          subheader={user.email}
          action={
            <Fragment>
              <IconButton
                href='/account/profile/home'
                color='primary'
                component='a'
                style={{ marginRight: 5 }}
                size='large'
              >
                <FontAwesomeIcon icon={faHome} size='xs' />
              </IconButton>
              <Button href='/account/profile/update'>
                <FormattedMessage id='UPDATE' />
              </Button>
              <Button href='/account/profile/photos'>
                <FormattedMessage id='PHOTOS' />
              </Button>
              <Button href='/account/profile/change-password'>
                <FormattedMessage id='CHANGE_PASSWORD' />
              </Button>
            </Fragment>
          }
          classes={{ action: styles.headerAction }}
        />
      </Card>
    </Fragment>
  );
};
