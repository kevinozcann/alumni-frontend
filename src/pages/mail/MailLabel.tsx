import React from 'react';
import { NavLink as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import InboxIcon from '@mui/icons-material/Inbox';
import DeleteIcon from '@mui/icons-material/Delete';
import DraftsIcon from '@mui/icons-material/Drafts';
import LabelIcon from '@mui/icons-material/Label';
import ReportIcon from '@mui/icons-material/Report';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

import useTranslation from 'hooks/useTranslation';
import { IMailLabel } from './mail-types';

const systemLabelIcons = {
  all: EmailIcon,
  inbox: InboxIcon,
  trash: DeleteIcon,
  drafts: DraftsIcon,
  spam: ReportIcon,
  sent: SendIcon,
  starred: StarIcon,
  important: LabelImportantIcon
};

const getIcon = (label: any) => {
  if (label.type === 'system_label') {
    return systemLabelIcons[label.id];
  }

  return LabelIcon;
};

const getTo = (label: any): string => {
  const baseUrl = '/mail';

  if (label.type === 'system_label') {
    return `${baseUrl}/${label.id}`;
  }

  if (label.type === 'custom_label') {
    return `${baseUrl}/label/${label.name}`;
  }

  return baseUrl;
};

const getColor = (label: any): string => {
  if (label.type === 'custom_label') {
    return label.color;
  }

  return null;
};

type TMailLabelProps = {
  label: IMailLabel;
};

export const MailLabel = (props: TMailLabelProps) => {
  const { section } = useParams();
  const { label, ...other } = props;
  const intl = useTranslation();

  const Icon = getIcon(label);
  const to = getTo(label);
  const color = getColor(label);
  const displayUnreadCount = Boolean(label.unreadCount && label.unreadCount > 0);

  return (
    <ListItem disableGutters sx={{ py: 1 }} {...other}>
      <ButtonBase
        component={RouterLink}
        sx={{
          borderBottomRightRadius: '18px',
          borderTopRightRadius: '18px',
          color: 'text.secondary',
          flexGrow: 1,
          fontWeight: 'fontWeightRegular',
          height: '36px',
          paddingLeft: '12px',
          paddingRight: '12px',
          '&:hover': {
            backgroundColor: 'action.hover'
          },
          '&.exactMatch': {
            backgroundColor: 'action.selected',
            fontWeight: 'fontWeightMedium'
          }
        }}
        to={to}
        className={section === label.id ? 'exactMatch' : ''}
      >
        <Box sx={{ display: 'flex', mr: 1 }}>
          <Icon color='inherit' style={{ color }} />
        </Box>
        <Typography sx={{ flexGrow: 1, fontWeight: 'inherit' }} variant='body2'>
          {intl.formatMessage({ id: `email.${label.name}` })}
        </Typography>

        {displayUnreadCount && (
          <Typography color='inherit' variant='caption'>
            {label.unreadCount}
          </Typography>
        )}
      </ButtonBase>
    </ListItem>
  );
};

export default MailLabel;
