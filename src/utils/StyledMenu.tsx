import React from 'react';
import Menu, { MenuProps } from '@mui/material/Menu';
import { styled, alpha } from '@mui/material/styles';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: theme.shadows[3],
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 150,
    color: theme.palette.mode === 'light' ? theme.palette.text.secondary : theme.palette.grey[300],
    '& .MuiList-root': {
      ...(theme.typography.body1 as React.CSSProperties),
      '& .MuiSvgIcon-root': {
        fontSize: 14,
        width: 16,
        marginRight: theme.spacing(1)
      },
      '& svg': {
        fontSize: 14,
        width: 16,
        marginRight: theme.spacing(1)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}));

export default StyledMenu;
