import React from 'react';
import { Box, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

const AllCaughtUp: React.FC<{ message: string }> = ({ message }) => {
  const intl = useIntl();

  return (
    <Box
      sx={{
        m: 2,
        height: 225,
        paddingTop: 11,
        textAlign: 'center'
      }}
    >
      <Typography variant='body2'>
        {intl.formatMessage({ id: 'app.all_caught_up' })}
        <br />
        <FormattedMessage id={message} />
      </Typography>
    </Box>
  );
};

export default AllCaughtUp;
