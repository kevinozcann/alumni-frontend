import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-duotone-svg-icons';

import useTranslation from 'hooks/useTranslation';
import StyledMenu from 'utils/StyledMenu';

interface ResponsiveAction {
  key: string;
  title: string;
  startIcon?: React.ReactNode;
  navigate?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement | HTMLLIElement>;
}
type TResponsiveActionsProps = {
  actions: ResponsiveAction[];
};

const ResponsiveActions = ({ actions }: TResponsiveActionsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const intl = useTranslation();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& svg': {
            fontSize: '14px !important'
          }
        }}
      >
        {actions?.map((action) => {
          const actionOnClick = action?.onClick;

          return (
            <Button
              key={action.key}
              type='button'
              aria-label={action.title}
              title={action.title}
              startIcon={action.startIcon}
              component={(action?.navigate && RouterLink) || null}
              to={action?.navigate || null}
              onClick={actionOnClick}
            >
              {action.title}
            </Button>
          );
        })}
      </Box>

      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& svg': {
            margin: '0 4px',
            fontSize: '14px !important'
          }
        }}
      >
        <Button
          id='actions-button'
          type='button'
          aria-controls={open ? 'actions-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          endIcon={<FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />}
          onClick={handleClick}
        >
          {intl.translate({ id: 'app.actions' })}
        </Button>
        <StyledMenu
          id='actions-menu'
          keepMounted
          MenuListProps={{
            'aria-labelledby': 'actions-menu'
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {actions?.map((action) => {
            const actionOnClick = action?.onClick || null;

            return (
              <MenuItem
                key={action.key}
                component={(action?.navigate && RouterLink) || null}
                to={action?.navigate || null}
                onClick={(event: any) => {
                  handleClose();
                  actionOnClick && actionOnClick(event);
                }}
                disableRipple
              >
                {action.startIcon}
                {action.title}
              </MenuItem>
            );
          })}
        </StyledMenu>
      </Box>
    </>
  );
};

export default ResponsiveActions;
