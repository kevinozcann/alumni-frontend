import React from 'react';
import { useNavigate } from 'react-router';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toAbsoluteUrl } from 'utils/AssetsHelpers';

import { IConfigLink } from './Config';

interface TConfigCardProps {
  configLink: IConfigLink;
}

const ConfigCard: React.FC<TConfigCardProps> = ({ configLink }) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(configLink.url);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{
          height: 0,
          backgroundColor: 'text.primary',
          paddingTop: '56.25%' // 16:9
        }}
        image={toAbsoluteUrl('/media/images/puzzle.svg')}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          <FontAwesomeIcon icon={configLink.icon} style={{ width: 24, marginRight: 8 }} />
          {intl.formatMessage({ id: configLink.title })}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {intl.formatMessage({ id: configLink.description })}
        </Typography>
      </CardContent>
      <CardActions>
        <Button aria-label='share' onClick={handleClick}>
          {intl.formatMessage({ id: 'app.show' })}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {configLink.admin && <Chip label='Admin' variant='outlined' color='secondary' />}
      </CardActions>
    </Card>
  );
};

export default ConfigCard;
