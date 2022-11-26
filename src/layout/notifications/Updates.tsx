import React from 'react';
import {
  Alert,
  Avatar,
  Chip,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/pro-duotone-svg-icons';

import { useTranslation } from 'hooks/useTranslation';
import { createMarkup, ShortDate } from 'utils/Helpers';
import { TLang } from 'utils/shared-types';

import AllCaughtUp from './AllCaughtUp';

export interface IUpdate {
  id: string;
  title: string;
  details: string;
  version: string;
  updateDate: string;
  updateType: string;
  updateIcon: IconName;
}
type TUpdatesProps = {
  lang: TLang;
  updates: IUpdate[];
  updatesPhase: string;
};
const Updates = (props: TUpdatesProps) => {
  const { lang, updates } = props;
  const intl = useTranslation();

  return (
    <React.Fragment>
      {/* {updatesPhase === 'PULLING' && (
        <Box
          sx={{
            mt: 1,
            mx: 2
          }}>
          <SchoostLinearProgress />
        </Box>
      )} */}

      {!updates && <AllCaughtUp message='NO_RECORD' />}

      {updates && (
        <React.Fragment>
          {lang !== 'en' && (
            <Alert variant='standard' severity='info'>
              {intl.formatMessage({ id: 'notifications.recent_updates_available_in_english' })}
            </Alert>
          )}

          <List disablePadding>
            {updates?.map((update) => {
              return (
                <React.Fragment key={update.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText'
                        }}
                      >
                        <FontAwesomeIcon icon={['fad', update.updateIcon]} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link
                          color='textPrimary'
                          sx={{ cursor: 'pointer' }}
                          underline='none'
                          variant='subtitle2'
                        >
                          {update.title}
                        </Link>
                      }
                      secondary={<ShortDate date={update.updateDate} />}
                    />
                    <ListItemSecondaryAction>
                      <Chip size='small' color='primary' label={update.version} />
                    </ListItemSecondaryAction>
                    {/* <div
                  className='text-dark-50'
                  dangerouslySetInnerHTML={createMarkup(update.details)}
                /> */}
                  </ListItem>
                  <ListItem divider>
                    <ListItemText
                      sx={{ paddingLeft: 2 }}
                      secondary={<div dangerouslySetInnerHTML={createMarkup(update.details)} />}
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Updates;
