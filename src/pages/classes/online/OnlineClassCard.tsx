import React from 'react';
import { useNavigate } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlarmClock,
  faCalendar,
  faClock,
  faEdit,
  faTrash
} from '@fortawesome/pro-duotone-svg-icons';
import { format, isPast, isToday } from 'date-fns';

import useTranslation from 'hooks/useTranslation';
import getInitials from 'utils/getInitials';
import StyledMenu from 'utils/StyledMenu';

import { IOnlineClass } from 'pages/classes/_store/types';

const OnlineClassCard = (props: { classs: IOnlineClass; langPack: Record<string, string> }) => {
  const { classs, langPack } = props;
  const intl = useTranslation();
  const navigate = useNavigate();
  const [anchorAmEl, setAnchorAmEl] = React.useState<null | HTMLElement>(null);
  const [anchorBamEl, setAnchorBamEl] = React.useState<null | HTMLElement>(null);
  const isAmOpen = Boolean(anchorAmEl);
  const isBamOpen = Boolean(anchorBamEl);
  const ITEM_HEIGHT = 48;

  const startsAt = new Date(classs.startsAt);
  const endsAt = new Date(classs.endsAt);
  const ispast = isPast(endsAt);
  const istoday = isToday(endsAt);

  const handleActionsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAmEl(event.currentTarget);
  };
  const handleActionsMenuClose = () => {
    setAnchorAmEl(null);
  };
  const handleBactionsMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorBamEl(event.currentTarget);
  };
  const handleBactionsMenuClose = () => {
    setAnchorBamEl(null);
  };

  return (
    <Card
      raised
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader
        // avatar={<Avatar aria-label='avatar'>{getInitials(`${classs.title}`)}</Avatar>}
        title={`${classs.title}`}
        subheader={`${classs?.description || ''}`}
        action={
          <Box sx={{ display: 'flex' }}>
            <IconButton
              id='class-more'
              aria-label='more'
              size='large'
              aria-expanded={isAmOpen ? 'true' : undefined}
              aria-haspopup='true'
              onClick={handleActionsMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
            <StyledMenu
              id='class-more-menu'
              MenuListProps={{
                'aria-labelledby': 'class-more-menu'
              }}
              anchorEl={anchorAmEl}
              open={isAmOpen}
              onClose={handleActionsMenuClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch'
                }
              }}
            >
              <MenuItem
                key='class-edit'
                onClick={() => {
                  setAnchorAmEl(null);
                  navigate(`/classes/online/${classs.id}/edit`);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faEdit} />
                {intl.translate({ id: 'app.edit' })}
              </MenuItem>
              <MenuItem
                key='class-delete'
                onClick={() => {
                  setAnchorAmEl(null);
                  navigate(`/classes/online/${classs.id}/delete`);
                }}
                disableRipple
              >
                <FontAwesomeIcon icon={faTrash} color='red' />
                {intl.translate({ id: 'app.delete' })}
              </MenuItem>
            </StyledMenu>
          </Box>
        }
      />

      <CardContent sx={{ pb: 1 }}>
        {classs.teacher && (
          <Chip
            icon={
              <Avatar sx={{ width: 24, height: 24 }} src={`${classs.teacher}`} alt='ss'>
                {getInitials('Ahmet Tek')}
              </Avatar>
            }
            label={`Ahmet Tek`}
            variant='outlined'
          />
        )}
      </CardContent>

      <CardContent sx={{ pt: 1, display: 'flex', gap: 1, height: '100%' }}>
        {!ispast && istoday && (
          <Chip
            icon={<FontAwesomeIcon icon={faAlarmClock} size='2x' />}
            label={format(startsAt, 'p')}
            variant='outlined'
          />
        )}
        {!ispast && !istoday && (
          <Chip
            icon={<FontAwesomeIcon icon={faCalendar} size='2x' />}
            label={format(startsAt, 'Pp')}
            variant='outlined'
          />
        )}
        {!ispast && (
          <Chip
            icon={<FontAwesomeIcon icon={faClock} size='2x' />}
            label={intl.translate({ id: 'app.date.x.min' }, { x: classs.duration })}
            variant='outlined'
          />
        )}
      </CardContent>

      <CardActions>
        {ispast && (
          <Button variant='text' disabled aria-label={langPack.transClassOver}>
            {langPack.transClassOver}
          </Button>
        )}
        {!ispast && (
          <Button
            variant='text'
            aria-label={langPack.transJoinAsTeacher}
            onClick={() => navigate(`/classes/online/${classs.id}/join/teacher`)}
          >
            {langPack.transJoinAsTeacher}
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          id='class-more'
          aria-label='more'
          size='large'
          aria-expanded={isBamOpen ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleBactionsMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <StyledMenu
          id='class-more-menu'
          MenuListProps={{
            'aria-labelledby': 'class-more-menu'
          }}
          anchorEl={anchorBamEl}
          open={isBamOpen}
          onClose={handleBactionsMenuClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch'
            }
          }}
        >
          {!ispast && (
            <MenuItem
              key='join-as-student'
              aria-label={langPack.transJoinAsStudent}
              onClick={() => {
                setAnchorBamEl(null);
                navigate(`/classes/online/${classs.id}/join/student`);
              }}
              disableRipple
            >
              <FontAwesomeIcon icon={faTrash} />
              {langPack.transJoinAsStudent}
            </MenuItem>
          )}
          {ispast && classs.replayUrl && (
            <MenuItem
              key='replay-recording'
              aria-label={langPack.transPlayRecording}
              onClick={() => {
                setAnchorBamEl(null);
                navigate(`/classes/online/${classs.id}/play`);
              }}
              disableRipple
            >
              <FontAwesomeIcon icon={faTrash} />
              {langPack.transPlayRecording}
            </MenuItem>
          )}
        </StyledMenu>
      </CardActions>
    </Card>
  );
};

export default OnlineClassCard;
