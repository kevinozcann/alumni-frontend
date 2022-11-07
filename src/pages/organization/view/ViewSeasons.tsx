import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Chip,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase } from '@fortawesome/pro-duotone-svg-icons';

import useTranslation from 'hooks/useTranslation';
import { ISeason } from 'pages/organization/organization-types';

type TSeasonsFormProps = {
  seasons?: ISeason[];
  values?: any;
  errors?: any;
  isSubmitting?: boolean;
  handleChangeCheckbox?: (event: React.ChangeEvent<HTMLInputElement>, season: ISeason) => void;
};

const ViewSeasons = (props: TSeasonsFormProps) => {
  const { seasons } = props;
  const intl = useTranslation();

  return (
    <Box>
      <List>
        {seasons?.map((season: ISeason) => (
          <ListItem
            key={season.id}
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  edge='end'
                  aria-label='edit'
                  component={RouterLink}
                  to={`edit/${season.id}`}
                >
                  <EditIcon color='primary' />
                </IconButton>

                <IconButton
                  edge='end'
                  aria-label='delete'
                  component={RouterLink}
                  to={`delete/${season.id}`}
                >
                  <DeleteIcon color='secondary' />
                </IconButton>
              </Box>
            }
          >
            <ListItemButton>
              <ListItemIcon>
                <FontAwesomeIcon icon={faDatabase} />
              </ListItemIcon>
              <ListItemText sx={{ flex: 'none' }} primary={season.title} />
              {season.isDefault === 'on' && (
                <Chip
                  sx={{ mx: 1 }}
                  size='small'
                  label={intl.formatMessage({ id: 'app.default' })}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ViewSeasons;
