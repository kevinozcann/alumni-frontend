import React from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { THEMES } from '../config';
import { ILayoutSettings } from '../contexts/SettingsContext';

type TSettingsDrawerProps = {
  open: boolean;
  values: ILayoutSettings;
  handleClose: () => void;
  handleChange: (field: string, value: any) => void;
  handleSave: () => void;
};

const SettingsDrawer: React.FC<TSettingsDrawerProps> = (props) => {
  const { values, open, handleClose, handleChange, handleSave } = props;
  const intl = useIntl();

  return (
    <React.Fragment>
      <Drawer
        anchor='right'
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: {
            p: 2,
            width: 320
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography color='textPrimary' variant='h6'>
            {intl.formatMessage({
              id: 'app.settings'
            })}
          </Typography>
          <IconButton onClick={handleClose} size='large'>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label='Theme'
            name='theme'
            onChange={(event): void => handleChange('theme', event.target.value)}
            select
            SelectProps={{ native: true }}
            value={values.theme}
            variant='outlined'
          >
            {Object.keys(THEMES).map((theme) => (
              <option key={theme} value={theme}>
                {theme
                  .split('_')
                  .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                  .join(' ')}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.direction === 'rtl'}
                color='primary'
                edge='start'
                name='direction'
                onChange={(event): void =>
                  handleChange('direction', event.target.checked ? 'rtl' : 'ltr')
                }
              />
            }
            label={
              <div>
                RTL
                <Typography color='textSecondary' component='p' variant='caption'>
                  Change text direction
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.responsiveFontSizes}
                color='primary'
                edge='start'
                name='direction'
                onChange={(event): void =>
                  handleChange('responsiveFontSizes', event.target.checked)
                }
              />
            }
            label={
              <div>
                Responsive font sizes
                <Typography color='textSecondary' component='p' variant='caption'>
                  Adjust font for small devices
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.compact}
                color='primary'
                edge='start'
                name='compact'
                onChange={(event): void => handleChange('compact', event.target.checked)}
              />
            }
            label={
              <div>
                Compact
                <Typography color='textSecondary' component='p' variant='caption'>
                  Fixed width on some screens
                </Typography>
              </div>
            }
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            px: 1.5
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={values.roundedCorners}
                color='primary'
                edge='start'
                name='roundedCorners'
                onChange={(event): void => handleChange('roundedCorners', event.target.checked)}
              />
            }
            label={
              <div>
                Rounded Corners
                <Typography color='textSecondary' component='p' variant='caption'>
                  Increase border radius
                </Typography>
              </div>
            }
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button color='primary' fullWidth onClick={handleSave} variant='contained'>
            {intl.formatMessage({ id: 'app.save' })}
          </Button>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default SettingsDrawer;
