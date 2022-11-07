import React from 'react';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faDatabase } from '@fortawesome/pro-duotone-svg-icons';

import Scrollbar from 'layout/Scrollbar';
import useTranslation from 'hooks/useTranslation';
import { ISchool, ISeason } from 'pages/organization/organization-types';

type TSeasonsPopoverParams = {
  itemKey: string;
  headerText?: string;
  activeSchool?: ISchool;
  activeSeason?: ISeason;
  align?: 'left' | 'center' | 'right';
  changeSeason?: (season: ISeason) => void;
};

const SeasonsPopover = (props: TSeasonsPopoverParams) => {
  const { itemKey, activeSchool, activeSeason, headerText, align, changeSeason } = props;
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const intl = useTranslation();
  const [open, setOpen] = React.useState<boolean>(false);

  const headerMessage =
    headerText ||
    intl.formatMessage({
      id: 'app.select_season'
    });

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleClick = (season: ISeason): void => {
    handleClose();

    changeSeason(season);
  };

  return activeSchool?.seasons?.length > 0 ? (
    <React.Fragment>
      <Box
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          '& svg': {
            fontSize: '14px !important'
          }
        }}
      >
        <Button
          sx={{ textTransform: 'none', whiteSpace: 'nowrap', px: 1 }}
          size='small'
          variant='outlined'
          startIcon={<FontAwesomeIcon icon={faDatabase} />}
          endIcon={activeSchool?.seasons?.length > 1 && <FontAwesomeIcon icon={faChevronDown} />}
        >
          {itemKey}
        </Button>
      </Box>
      {activeSchool?.seasons?.length > 1 && (
        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: align
          }}
          keepMounted
          onClose={handleClose}
          open={open}
          PaperProps={{
            sx: { minWidth: 140, maxWidth: 240 }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography color='textPrimary' variant='subtitle2'>
              {headerMessage}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ my: 1, maxHeight: 300 }}>
            <Scrollbar options={{ suppressScrollX: true, wheelSpeed: 2, wheelPropagation: false }}>
              {activeSchool?.seasons?.map((season: ISeason) => (
                <MenuItem
                  key={season?.id}
                  onClick={() => handleClick(season)}
                  sx={{
                    backgroundColor: season?.id === activeSeason?.id ? 'background.default' : null
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      width: 10,
                      marginRight: 1.5
                    }}
                  >
                    <FontAwesomeIcon icon={faDatabase} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography color='textPrimary' variant='subtitle2'>
                        {season?.title}
                      </Typography>
                    }
                  />
                  {season?.id === activeSeason?.id && (
                    <ListItemIcon>
                      <CheckCircleIcon color='success' />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </Scrollbar>
          </Box>
        </Popover>
      )}
    </React.Fragment>
  ) : null;
};

export default SeasonsPopover;
