import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
// import { useIntl } from 'react-intl';
import moment from 'moment';
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { amber } from '@mui/material/colors';
import { Star, StarBorder } from '@mui/icons-material';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import getInitials from 'utils/getInitials';

import { IMail, IMailLabel, IUserMail } from './mail-types';
import useTranslation from 'hooks/useTranslation';

interface MailItemProps {
  handleStarClick: (mailId: number, starred: boolean) => void;
  handleForwardClick: (email: IMail) => void;
  labels: IMailLabel[];
  mail: IUserMail;
  onDeselect?: () => void;
  onSelect?: () => void;
  selected: boolean;
}

const getTo = (section: string, label: string, mailId: number) => {
  const baseUrl = '/mail';

  if (section) {
    return `${baseUrl}/${section}/${mailId}`;
  }

  if (label) {
    return `${baseUrl}/label/${label}/${mailId}`;
  }

  return baseUrl;
};

const MailItem = (props: MailItemProps) => {
  const { handleStarClick, handleForwardClick, mail, onDeselect, onSelect, selected } = props;
  const theme = useTheme();
  const { section, label } = useParams();
  const {
    id: mailId,
    email: { subject, sender, sentAt, emailToUser },
    isTo,
    isCc,
    isBcc,
    isRead,
    isStarred
  } = mail;
  const [starred, setStarred] = React.useState(isStarred);
  const intl = useTranslation();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target;

    if (checked && onSelect) {
      onSelect();
    }

    if (!checked && onDeselect) {
      onDeselect();
    }
  };

  const handleStarToggle = (): void => {
    setStarred(!starred);
    handleStarClick(mailId, !starred);
  };

  const draftValues: IMail = {
    subject: mail?.email?.subject,
    msgBody: mail?.email?.msgBody
  };

  const handleForwardToggle = (): void => {
    handleForwardClick(draftValues);
  };

  const to = getTo(section, label, mailId);

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        borderBottom: (theme) => ` 1px solid ${theme.palette.divider}`,
        display: 'flex',
        p: 2,
        ...(!isRead && {
          position: 'relative',
          '&:before': {
            backgroundColor: 'error.main',
            content: '" "',
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: 4
          },
          '& $name, & $subject': {
            fontWeight: 600
          }
        }),
        ...(selected && {
          backgroundColor: 'action.selected'
        }),
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    >
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mr: 1
          }}
        >
          <Checkbox checked={selected} color='primary' onChange={handleCheckboxChange} />
          <Tooltip title='Starred'>
            <IconButton onClick={handleStarToggle}>
              {mail.isStarred ? (
                <Star fontSize='small' sx={{ color: amber[400] }} />
              ) : (
                <StarBorder fontSize='small' />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title={intl.formatMessage({ id: 'forward' })}>
            <IconButton onClick={handleForwardToggle}>
              <ShortcutIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title='Important'>
            <IconButton onClick={handleImportantToggle}>
              {mail.isImportant ? (
                <LabelImportantIcon fontSize='small' sx={{ color: amber[400] }} />
              ) : (
                <LabelImportantIcon fontSize='small' />
              )}
            </IconButton>
          </Tooltip> */}
        </Box>
      </Box>
      <Box
        component={RouterLink}
        to={to}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexGrow: 1,
          minWidth: '1px',
          textDecoration: 'none'
        }}
      >
        {section == 'sent' ? (
          <Avatar
            sx={{ backgroundColor: 'primary.main' }}
            alt={emailToUser?.fullName}
            src={emailToUser?.picture}
          >
            {getInitials(emailToUser?.fullName)}
          </Avatar>
        ) : (
          <Avatar
            sx={{ backgroundColor: 'primary.main' }}
            alt={sender?.fullName || sender?.name}
            src={sender?.picture}
          >
            {getInitials(sender?.fullName || sender?.name)}
          </Avatar>
        )}

        <Box
          sx={{
            alignItems: {
              md: 'center'
            },
            display: {
              md: 'flex'
            },
            flexGrow: {
              md: 1
            },
            minWidth: '1px',
            ml: 1
          }}
        >
          <Typography
            component='div'
            color={theme.palette.text.secondary}
            sx={{
              flexBasis: {
                md: 180
              },
              minWidth: {
                md: 180
              },
              ...(mail.isRead && {
                fontWeight: 600
              })
            }}
          >
            {section == 'sent' ? emailToUser?.fullName : sender?.fullName}
            {isTo && (
              <Chip
                sx={{
                  fontSize: 7,
                  height: 11,
                  ml: 1,
                  '& span': {
                    padding: 1
                  }
                }}
                label='TO'
              />
            )}
            {isCc && (
              <Chip
                sx={{
                  fontSize: 7,
                  height: 11,
                  ml: 1,
                  '& span': {
                    padding: 1
                  }
                }}
                label='CC'
              />
            )}
            {isBcc && (
              <Chip
                sx={{
                  fontSize: 7,
                  height: 11,
                  ml: 1,
                  '& span': {
                    padding: 1
                  }
                }}
                label='BCC'
              />
            )}
          </Typography>
          <Typography
            color='textSecondary'
            sx={{
              maxWidth: 400,
              mr: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              ...(mail.isRead && {
                fontWeight: 600
              })
            }}
            variant='body2'
          >
            {subject}
          </Typography>
          <Box sx={{ display: { md: 'block', xs: 'none' } }}>
            <Typography
              color='textSecondary'
              sx={{
                flexGrow: 1,
                marginRight: 'auto',
                maxWidth: 800,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              variant='body2'
            >
              {/* -{msgBody} */}
            </Typography>
            {/* {mail.labelIds.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  mx: 2
                }}>
                {mail.labelIds.map((labelId: number) => {
                  const label = labels.find((_label) => parseInt(_label.id) === labelId);

                  if (!label) {
                    return null;
                  }

                  return (
                    // <Label key={label.id} sx={{ backgroundColor: label.color }}>
                    <Label key={label.id}>{label.name}</Label>
                  );
                })}
              </Box>
            )} */}
          </Box>
          <Typography color='textSecondary' noWrap variant='caption'>
            {moment(sentAt).format('llll')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MailItem;
