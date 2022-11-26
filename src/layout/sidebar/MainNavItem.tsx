import React from 'react';
import { useIntl } from 'react-intl';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IMenu } from 'pages/admin/menu-types';

type TMainNavItem = {
  menu: IMenu;
  isActiveMenu: boolean;
  handleClick: (menu: IMenu) => void;
};

const MainNavItem = ({ menu, isActiveMenu, handleClick }: TMainNavItem) => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <ListItemButton sx={{ px: 2 }} onClick={() => handleClick(menu)}>
        <ListItemIcon>
          <Box sx={{ fontSize: '12px !important', width: '16px' }}>
            <FontAwesomeIcon icon={[menu.iconPrefix, menu.icon]} />
          </Box>
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: menu.title })} />
        {!isActiveMenu && <FontAwesomeIcon icon={['fad', 'angle-right']} />}
      </ListItemButton>
    </React.Fragment>
  );
};

export default MainNavItem;
