import React from 'react';
import clsx from 'clsx';
import { colors } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    borderRadius: '50%',
    flexGrow: 0,
    flexShrink: 0
  },
  small: {
    height: theme.spacing(1),
    width: theme.spacing(1)
  },
  medium: {
    height: theme.spacing(2),
    width: theme.spacing(2)
  },
  large: {
    height: theme.spacing(3),
    width: theme.spacing(3)
  },
  offline: {
    backgroundColor: colors.grey[50]
  },
  away: {
    backgroundColor: colors.orange[600]
  },
  busy: {
    backgroundColor: colors.red[600]
  },
  online: {
    backgroundColor: colors.green[600]
  }
}));

const OnlineIndicator = ({ className, size, status, ...rest }) => {
  const classes = useStyles();

  return (
    <span
      className={clsx(
        {
          [classes.root]: true,
          [classes[size]]: size,
          [classes[status]]: status
        },
        className
      )}
      {...rest}
    />
  );
};

export default OnlineIndicator;
