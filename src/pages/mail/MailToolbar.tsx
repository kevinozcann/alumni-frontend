import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type MailToolbarProps = {
  section: string;
  label: string;
};

const MailToolbar = ({ section, label }: MailToolbarProps) => {
  const navigate = useNavigate();

  const handleBack = (): void => {
    if (label) {
      return navigate(`/mail/label/${label}`);
    }

    if (section) {
      return navigate(`/mail/${section}`);
    }

    return navigate('/mail/inbox');
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexShrink: 0,
        height: 68,
        p: 2
      }}
    >
      <Tooltip title='Back'>
        <IconButton onClick={handleBack} size='large'>
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Box sx={{ flexGrow: 1 }} />
      {/* <Hidden mdDown>
        <Box sx={{ width: 200 }}>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              )
            }}
            placeholder='Search message'
            size='small'
            variant='outlined'
          />
        </Box>
      </Hidden>
      <Tooltip title='Previous email'>
        <IconButton>
          <ChevronLeftIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Next email'>
        <IconButton>
          <ChevronRightIcon fontSize='small' />
        </IconButton>
      </Tooltip> */}
    </Box>
  );
};

export default MailToolbar;
