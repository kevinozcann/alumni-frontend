import React from 'react';
import { Box, Button, Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { IFilter } from './Filter';

interface MultiSelectProps {
  label: string;
  onChange?: (value: IFilter[]) => void;
  filters: IFilter[];
  value: IFilter[];
}

const MultiSelect = (props: MultiSelectProps) => {
  const { label, onChange, filters, value, ...other } = props;
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  const handleOptionToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let newValue = [...value];

    if (event.target.checked) {
      newValue.push(filters.find((f) => f.id === event.target.value));
    } else {
      newValue = newValue.filter((f) => f.id !== event.target.value);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ mx: 1 }}>
      <Button
        color='inherit'
        endIcon={<KeyboardArrowDown fontSize='small' />}
        onClick={handleMenuOpen}
        ref={anchorRef}
        variant='text'
        {...other}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        elevation={1}
        onClose={handleMenuClose}
        open={openMenu}
        PaperProps={{ style: { width: 250 } }}
      >
        {filters.map((filter) => (
          <MenuItem key={filter.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value?.map((v) => v.id).indexOf(filter.id) > -1}
                  color='primary'
                  onChange={handleOptionToggle}
                  value={filter.id}
                />
              }
              label={filter.title}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MultiSelect;
