import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IMenu } from 'pages/admin/menu-types';
import { faCircle } from '@fortawesome/pro-duotone-svg-icons';

type TNavItemProps = {
  activeMenu: IMenu;
  handleMenuClick: (menu: IMenu) => void;
};

const ActiveMenuItems = (props: TNavItemProps) => {
  const { activeMenu, handleMenuClick } = props;
  const intl = useIntl();

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component='div'
      subheader={
        <ListSubheader sx={{ textTransform: 'uppercase' }} component='div' disableSticky>
          {intl.formatMessage({ id: activeMenu.title })}
        </ListSubheader>
      }
    >
      {activeMenu?.children?.map((item: IMenu) => {
        const { children } = item;

        return (
          <React.Fragment key={item.id}>
            <ListItemButton
              component={(children && null) || RouterLink}
              to={(children && null) || item.url}
              sx={{ px: 2, width: '100%' }}
              onClick={() => handleMenuClick(item)}
            >
              <ListItemIcon>
                <FontAwesomeIcon
                  icon={[item.iconPrefix, item.icon]}
                  color='primary.main'
                  size='sm'
                />
              </ListItemIcon>
              <ListItemText primary={intl.formatMessage({ id: item.title })} />
            </ListItemButton>

            {children && (
              <Collapse in timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {children.map((child) => {
                    return (
                      <ListItemButton
                        key={child.id}
                        sx={{ pl: 4 }}
                        component={RouterLink}
                        to={child.url}
                        onClick={() => handleMenuClick(child)}
                      >
                        <ListItemIcon>
                          <Box sx={{ fontSize: '12px !important', width: '16px' }}>
                            <FontAwesomeIcon icon={faCircle} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: child.title })} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default ActiveMenuItems;
